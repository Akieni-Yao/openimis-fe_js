import { createTheme } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles/colorManipulator";

const theme = createTheme({
  overrides: {
    MuiTableRow: {
      root: {
        "&$selected": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
  palette: {
    primary: { main: "#00913E" },
    secondary: { main: "#fff" },
    error: { main: "#801a00" },
    text: {
      primary: "#333333",
      secondary: "#666666", // HACK FOR material-table hardcoded toolbar!,
      second: "#fff",
      error: "#801a00",
    },
    toggledButton: "#999999",
  },
  typography: {
    useNextVariants: true,
    fontFamily: ["Rubik", "Roboto", '"Helvetica Neue"', "sans-serif"].join(","),
    fontSize: 14,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    title: {
      fontSize: 20,
      fontWeight: 300,
    },
    label: {
      color: "grey",
    },
  },
  jrnlDrawer: {
    open: {
      width: 500,
    },
    close: {
      width: 80,
    },
    itemDetail: {
      marginLeft: 8,
    },
    iconSize: 24,
  },
  menu: {
    variant: "AppBar",
    drawer: {
      width: 300,
      fontSize: 16,
    },
    appBar: {
      fontSize: 16,
    },
  },
  page: {
    padding: 16,
    locked: {
      background: "repeating-linear-gradient(45deg, #D3D3D3 1px, #D3D3D3 1px, #fff 10px, #fff 10px);",
    },
  },
  paper: {
    paper: {
      margin: 20,
      backgroundColor: "#ffffff",
      boxShadow: "0px 10px 10px #eee",
    },
    header: {
      // color: "#00913E",
      color: "#333",
      fontWeight: 500,
      // backgroundColor: "rgba(0,145,62,20%)",
      // backgroundColor: "rgba(0,145,62)",
      backgroundColor: "#D3F0E0",


    },
    message: {
      // backgroundColor: "#ffffff",
      // backgroundColor: "rgba(0,145,62,20%)",
      // backgroundColor: "rgba(0,145,62)",
      backgroundColor: "#D3F0E0",



    },
    title: {
      padding: 10,
      fontSize: 24,
      color: "#333",
      fontWeight: 500,
      // backgroundColor: "#ffffff",
      // backgroundColor: "rgba(0,145,62,20%)",
      // backgroundColor: "rgba(0,145,62)",
      backgroundColor: "#D3F0E0",


    },
    headerTitles: {
      padding: 10,
      fontSize: 24,
      fontWeight: 500,
      color: "#333",
    },
    action: {
      padding: 5,
    },
    divider: {
      padding: 0,
      margin: 0,
    },
    body: {
      marginTop: 10,
      backgroundColor: "#ffffff",
    },
    item: {
      padding: 10,
    },
  },
  table: {
    heading: {
      padding: 10,
      fontWeight: 600,
      color: "#333",
    },
    title: {
      padding: 10,
      fontWeight: 600,
      color: "#333",
      backgroundColor: "#D3F0E0",
      // backgroundColor: "rgba(0,145,62,10%)",

    },
    header: {
      color: "#666666",
    },
    headerAction: {
      padding: 5,
    },
    row: {
      color: "#00913E",
      align: "center",
      "&:hover": {
        background: "#F2F9F5",
      },
    },
    cell: {
      padding: 5,
    },
    lockedRow: {
      background: "repeating-linear-gradient(45deg, #D3D3D3 1px, #D3D3D3 1px, #fff 10px, #fff 10px);",
    },
    lockedCell: {},
    highlightedRow: {},
    highlightedCell: {
      fontWeight: 500,
      align: "center",
    },
    highlightedAltRow: {},
    highlightedAltCell: {
      fontStyle: "italic",
      align: "center",
    },
    disabledRow: {},
    disabledCell: {
      // textDecoration: "line-through",
      color: "grey",
      align: "center",
    },
    footer: {
      color: "#666666",
    },
    pager: {
      color: "#666666",
    },
  },
  form: {
    spacing: 10,
  },
  formTable: {
    table: {
      color: "#00913E",
    },
    actions: {
      color: "#00913E",
    },
    header: {
      color: "#00913E",
      align: "center",
    },
  },
  dialog: {
    title: {
      fontWeight: 500,
      color: "grey",
    },
    content: {
      padding: 0,
    },
    primaryButton: {
      backgroundColor: "#ffffff",
      color: "#00913E",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: alpha("#00913E", 0.5),
        color: "#ffffff",
      },
    },
    secondaryButton: {},
  },
  fab: {
    position: "fixed",
    bottom: 20,
    right: 8,
    zIndex: 2000,
  },
  fakeInput: {},
  bigAvatar: {
    width: 160,
    height: 160,
  },
  buttonContainer: {
    horizontal: {
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      justifyContent: "flex-end",
    },
  },
});

export default theme;
