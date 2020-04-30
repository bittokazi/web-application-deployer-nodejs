import React from "react";
import { UserInfoContext } from "./../providers/UserInfoProvider";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
  return (
    <UserInfoContext.Consumer>
      {(userContextConsumer) => (
        <nav class="navbar navbar-default navbar-static-top">
          <div class="navbar-header">
            <Link
              to="/"
              class="navbar-toggle hidden-sm hidden-md hidden-lg "
              href="javascript:void(0)"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              <i class="ti-menu"></i>
            </Link>
            <div class="top-left-part">
              <a class="logo">
                <i class="glyphicon glyphicon-fire"></i>&nbsp;
                <span class="hidden-xs">PMBT</span>
              </a>
            </div>
            <ul class="nav navbar-top-links navbar-left hidden-xs">
              <li>
                <a
                  href="javascript:void(0)"
                  class="open-close hidden-xs hidden-lg waves-effect waves-light"
                >
                  <i class="ti-arrow-circle-left ti-menu"></i>
                </a>
              </li>
            </ul>
            <ul class="nav navbar-top-links navbar-right pull-right">
              <li>
                <a class="profile-pic">
                  <img
                    src={
                      userContextConsumer.user != null &&
                      userContextConsumer.user.image
                    }
                    alt="user-img"
                    width="36"
                    class="img-circle"
                  />
                  <b class="hidden-xs">
                    {userContextConsumer.user != null &&
                      userContextConsumer.user.username}
                  </b>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </UserInfoContext.Consumer>
  );
}
