import React from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";

export default function Profile() {
  return (
    <AuthComponent>
      <div class="container-fluid">
        <div class="row bg-title">
          <div class="col-lg-12">
            <h4 class="page-title">Profile</h4>
            <DashboardBreadcrumb />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="white-box">
              <h3>Blank Page</h3>
            </div>
          </div>
        </div>
      </div>
    </AuthComponent>
  );
}
