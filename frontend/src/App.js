import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserInfoProvider from "./providers/UserInfoProvider";

function App() {
  return (
    <UserInfoProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </UserInfoProvider>
  );
}

export default App;
