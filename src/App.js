import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context";
import AppRoutes from "./routes";
import theme from "./theme";
import { getLoggedInUser } from "./utils";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authentication, setAuthentication] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser();
      if (user) {
        setLoggedInUser(user);
      }

      setAuthentication(true);
    };
    getUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {authentication ? (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthContext.Provider>
      ) : (
        <></>
      )}
    </ThemeProvider>
  );
}

export default App;
