import React, { Component } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";
import DashboardNotification from "./DashboardNotification";
import UserInfoProvider from "./../providers/UserInfoProvider";
import ChatComponent from "../components/dashboard/chat/ChatComponent";

export default class DashboardLayout extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <div class="preloader">
          <div class="cssload-speeding-wheel"></div>
        </div>
        <div id="wrapper">
          <DashboardHeader />
          <DashboardSidebar />
          {this.props.children}
          <DashboardFooter />
          <DashboardNotification />
          <ChatComponent />
        </div>
      </div>
    );
  }
}
