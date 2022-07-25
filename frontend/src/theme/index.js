import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: grey[100],
    },
    primary: {
      main: "#263238",
    },
    secondary: {
      main: "#ecf0f1",
    },
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
