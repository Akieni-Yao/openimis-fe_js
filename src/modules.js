
export const packages = [
  "@openimis/fe-core",
  "@openimis/fe-home",
  "@openimis/fe-location",
  "@openimis/fe-insuree",
  "@openimis/fe-medical",
  "@openimis/fe-medical_pricelist",
  "@openimis/fe-product",
  "@openimis/fe-policy",
  "@openimis/fe-payer",
  "@openimis/fe-contribution",
  "@openimis/fe-payment",
  "@openimis/fe-claim",
  "@openimis/fe-claim_batch",
  "@openimis/fe-admin",
  "@openimis/fe-tools",
  "@openimis/fe-profile",
  "@openimis/fe-language_fr",
  "@openimis/fe-calculation",
  "@openimis/fe-policyholder",
  "@openimis/fe-contribution_plan",
  "@openimis/fe-contract",
  "@openimis/fe-invoice"
];


export function loadModules (cfg = {}) {
  return [
    require("@openimis/fe-core").CoreModule(cfg["fe-core"] || {}),
    require("@openimis/fe-home").HomeModule(cfg["fe-home"] || {}),
    require("@openimis/fe-location").LocationModule(cfg["fe-location"] || {}),
    require("@openimis/fe-insuree").InsureeModule(cfg["fe-insuree"] || {}),
    require("@openimis/fe-medical").MedicalModule(cfg["fe-medical"] || {}),
    require("@openimis/fe-medical_pricelist").MedicalPriceListModule(cfg["fe-medical_pricelist"] || {}),
    require("@openimis/fe-product").ProductModule(cfg["fe-product"] || {}),
    require("@openimis/fe-policy").PolicyModule(cfg["fe-policy"] || {}),
    require("@openimis/fe-payer").PayerModule(cfg["fe-payer"] || {}),
    require("@openimis/fe-contribution").ContributionModule(cfg["fe-contribution"] || {}),
    require("@openimis/fe-payment").PaymentModule(cfg["fe-payment"] || {}),
    require("@openimis/fe-claim").ClaimModule(cfg["fe-claim"] || {}),
    require("@openimis/fe-claim_batch").ClaimBatchModule(cfg["fe-claim_batch"] || {}),
    require("@openimis/fe-admin").AdminModule(cfg["fe-admin"] || {}),
    require("@openimis/fe-tools").ToolsModule(cfg["fe-tools"] || {}),
    require("@openimis/fe-profile").ProfileModule(cfg["fe-profile"] || {}),
    require("@openimis/fe-language_fr").LanguageFrModule(cfg["fe-language_fr"] || {}),
    require("@openimis/fe-calculation").CalculationModule(cfg["fe-calculation"] || {}),
    require("@openimis/fe-policyholder").PolicyHolderModule(cfg["fe-policyholder"] || {}),
    require("@openimis/fe-contribution_plan").ContributionPlanModule(cfg["fe-contribution_plan"] || {}),
    require("@openimis/fe-contract").ContractModule(cfg["fe-contract"] || {}),
    require("@openimis/fe-invoice").InvoiceModule(cfg["fe-invoice"] || {})
  ];

}
