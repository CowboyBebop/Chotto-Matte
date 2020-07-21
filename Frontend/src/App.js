import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import themeObject from "./util/theme";
import jwtDecode from "jwt-decode";

//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

//MUI components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

const theme = createMuiTheme(themeObject);

const token = localStorage.FBIdToken;

let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Navbar></Navbar>
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
              <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
