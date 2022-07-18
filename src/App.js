import { ThemeProvider } from "@mui/material/styles";
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
