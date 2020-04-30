import React, { useContext } from "react";
import DashboardNavbarItem from "./DashboardNavbarItem";
import { UserInfoContext } from "./../providers/UserInfoProvider";
import config from "./../config";

export default function DashboardSidebar(props) {
  let subdomain = window.location.hostname.split(".");
  return (
    <UserInfoContext.Consumer>
      {userContextConsumer => (
        <div class="navbar-default sidebar nicescroll" role="navigation">
          <div class="sidebar-nav navbar-collapse ">
            <ul class="nav" id="side-menu">
              <li class="sidebar-search hidden-sm hidden-md hidden-lg">
                <div class="input-group custom-search-form">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search..."
                  />
                  <span class="input-group-btn">
                    <button class="btn btn-default" type="button">
                      <i class="ti-search"></i>{" "}
                    </button>
                  </span>
                </div>
              </li>
              {userContextConsumer.user != null &&
                userContextConsumer.user.access.sub.map(navItem => {
                  return (
                    <>
                      {(subdomain.length == config.subdomainNumber - 1 ||
                        !config.subdomainMode ||
                        (subdomain.length > config.subdomainNumber - 1 &&
                          navItem.path != "/select-tenant" &&
                          subdomain[0] != "www") ||
                        (subdomain.length > config.subdomainNumber - 1 &&
                          subdomain[0] == "www")) && (
                        <DashboardNavbarItem
                          item={navItem}
                        ></DashboardNavbarItem>
                      )}
                    </>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </UserInfoContext.Consumer>
  );
}
