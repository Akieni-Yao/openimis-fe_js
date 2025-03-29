pipeline {
    agent any
    environment {
        WEBHOOK_TOKEN = credentials('IMSFE_WH_TOKEN')
        ECR_REGISTRY = "767397924087.dkr.ecr.eu-west-3.amazonaws.com"
        REPO_NAME = "engineering/camu"
        AWS_REGION = "eu-west-3"
        GH_TOKEN = credentials('GH_TOKEN')
        REACT_APP_ABIS_URL = "https://abis.camu.cg/public/enrollment/index.html#/enroll"
        REACT_APP_GED_URL = "https://dms.camu.cg/backend/cnss"
        REACT_APP_USERNAME = credentials('GED_USERNAME_UAT')
        REACT_APP_PASSWORD = credentials('GED_PASSWORD_UAT')
        REACT_APP_ABIS_VERIFICATION_URL = "https://abis.camu.cg/public/enrollment/index.html#/verify"
        REACT_APP_IDLE_LOGOUT_TIME="1800000"
    }
    // triggers {
    //     // Use a generic webhook trigger and set conditions within the pipeline
    //     GenericTrigger(
    //         genericVariables: [
    //             [key: 'PR_ACTION', value: '$.action'],
    //             [key: 'PR_MERGED', value: '$.pull_request.merged'],
    //             [key: 'PR_TITLE', value: '$.pull_request.title'],
    //             [key: 'PR_BRANCH', value: '$.pull_request.base.ref'],
    //             [key: 'PR_URL', value: '$.pull_request.html_url'],
    //             [key: 'PR_AUTHOR', value: '$.pull_request.user.login'],
    //             [key: 'PR_COMMIT', value: '$.pull_request.head.sha']
    //         ],
    //         causeString: 'Triggered by Pull Request ${PR_ACTION} action on branch: ${PR_BRANCH}',
    //         token: '${WEBHOOK_TOKEN}',
    //         tokenCredentialId: 'IMSFE_WH_TOKEN',
    //         printContributedVariables: true,
    //         printPostContent: true,
    //         regexpFilterText: '$PR_ACTION$PR_MERGED$PR_BRANCH',
    //         regexpFilterExpression: '^closedtruemain$',
    //         silentResponse: false
    //     )
    // }
    stages{
        stage('SCM Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/main"]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Akieni-Yao/openimis-fe_js.git',
                        credentialsId: 'GH_Credentials'
                    ]]
                ])
            }
        }
        stage('Setup Module config') {
            steps {
                script {
                    sh '''
                        cp openimis-release.json openimis.json
                        cp package-release.json package.json
                        sed -i "s|git+https://github.com|git+https://apps-sa:${GH_TOKEN}@github.com|g" openimis.json
                    '''
                }
            }
        }
        stage('Setup Environment variables') {
            steps {
                script {
                    sh '''
                        chmod +x setup_env.sh
                        ./setup_env.sh
                    '''
                }
            }
        }
        stage('Extract appVersion') {
            steps {
                script {
                    // Extract the appVersion from Chart.yaml
                    def chartFile = '.cd/prod/Chart.yaml'
                    def appVersion = sh(script: "yq e '.appVersion' ${chartFile}", returnStdout: true).trim()
                    
                    // Set the appVersion as an environment variable
                    env.APP_VERSION = appVersion
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def IMAGE_TAG = "ims_frontend_prod-v${env.APP_VERSION}"
                    def IMAGE_NAME = "${ECR_REGISTRY}/${REPO_NAME}"
                    def FULL_IMAGE_NAME = "${IMAGE_NAME}:${IMAGE_TAG}"

                    env.IMAGE_TAG = IMAGE_TAG

                    echo "Checking if Docker image with tag ${IMAGE_TAG} already exists locally..."

                    def imageExists = sh(script: """
                        if docker image ls ${FULL_IMAGE_NAME} --format '{{.Repository}}:{{.Tag}}' | grep -q ${FULL_IMAGE_NAME}; then
                            echo "Image with tag ${IMAGE_TAG} already exists locally."
                            exit 0
                        else
                            echo "Image with tag ${IMAGE_TAG} does not exist locally."
                            exit 1
                        fi
                    """, returnStatus: true)

                    if (imageExists == 0) {
                        echo "Skipping build since the image already exists locally."
                    } else {
                        echo "Building Docker image with tag: ${IMAGE_TAG}"
                        docker.build("${FULL_IMAGE_NAME}")
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    def IMAGE_TAG = "ims_frontend_prod-v${env.APP_VERSION}"
                    def IMAGE_NAME = "${ECR_REGISTRY}/${REPO_NAME}"
                    def FULL_IMAGE_NAME = "${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    echo "Pushing Docker image: ${FULL_IMAGE_NAME}"
                    // Log in to ECR and push Docker image
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        docker push ${FULL_IMAGE_NAME}
                    """
                }
            }
        }
        stage('Update Application Image') {
            environment {
                VAULT_ADDR = 'https://vault.akieni.tech'
                VAULT_SECRETS_PATH = 'akieni/prod/camu-prod/ims-frontend-prod'
            }
            steps{
                script {
                    def secrets = []
                    withVault([vaultSecrets: secrets]) {
                        sh 'vault login -method=aws role=jenkins-role'
                        sh 'vault kv patch ${VAULT_SECRETS_PATH} IMAGE_TAG=${IMAGE_TAG}'
                    }
                }
            }
        }
        stage('Deploy IMS prod Frontend') {
            environment {
                ARGOCD_SERVER = credentials('argocd-server')
                ARGOCD_APP = "ims-frontend-prod"
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'argocd-cred', usernameVariable: "ARGOCD_USERNAME", passwordVariable: "ARGOCD_PASSWORD")]) {
                    script {
                        def server = 'https://argocd.akieni.tech'
                        sh '''
                            echo "Logging into ArgoCD server ${server}"
                            argocd login argocd.akieni.tech --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --grpc-web
                        '''
                        sh '''
                            echo "Synchronizing ArgoCD app: ${ARGOCD_APP}"
                            argocd app diff ${ARGOCD_APP} --hard-refresh --grpc-web
                        '''
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend(color: '#ADD8E6', message: """Build Succeeded for Production Environment
Job: '${env.JOB_NAME} [Build Number: ${env.BUILD_NUMBER}]' (<${env.BUILD_URL}|Click Here to view more>)""", channel: 'camu-ci-alerts')
        }
        failure {
            slackSend(color: '#B3000C', message: """Build Failed for Production Environment
Job: '${env.JOB_NAME} [Build Number: ${env.BUILD_NUMBER}]' (<${env.BUILD_URL}|Click Here to view more>)""", channel: 'camu-ci-alerts')
        }
        cleanup {
            cleanWs()
        }
    }
}