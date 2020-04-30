import React from "react";
import DashboardLayout from "./../../layouts/DashboardLayout";
import { Switch, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import Profile from "./profile/Profile";
import AddUser from "./user/AddUser";
import UserList from "./user/UserList";
import ApplicationList from "./application/ApplicationList";
import Logout from "./Logout";
import NotFound from "./NotFound";
import AddApplication from "./application/AddApplication";
import ShowApplication from "./application/ShowApplication";
import EditApplication from "./application/EditApplication";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Switch>
        <Route exact path="/dashboard" component={MainPage} />
        <Route exact path="/dashboard/profile" component={Profile} />
        <Route exact path="/dashboard/users/add" component={AddUser} />
        <Route exact path="/dashboard/users" component={UserList} />
        <Route
          exact
          path="/dashboard/applications/add"
          component={AddApplication}
        />
        <Route
          exact
          path="/dashboard/applications"
          component={ApplicationList}
        />
        <Route
          exact
          path="/dashboard/applications/edit/:id"
          component={EditApplication}
        />
        <Route
          exact
          path="/dashboard/applications/deploy/:id"
          component={ShowApplication}
        />
        <Route exact path="/dashboard/logout" component={Logout} />
        <Route path="/dashboard/*" component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}
