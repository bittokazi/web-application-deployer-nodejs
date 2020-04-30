import React from "react";
import { Link } from "react-router-dom";

const isActive = path => {
  if (path.split("/").length == 3) {
    if (path.split("/")[2] == window.location.pathname.split("/")[2]) {
      return `activeClass`;
    }
  }
  if (path.split("/").length == 4) {
    if (
      path.split("/")[2] == window.location.pathname.split("/")[2] &&
      path.split("/")[3] == window.location.pathname.split("/")[3]
    ) {
      return `activeClass`;
    }
  }
  if (path == window.location.pathname) {
    return `activeClass`;
  } else {
    return ``;
  }
};

const isActiveSub = path => {
  if (path == window.location.pathname) {
    return `activeClass`;
  } else {
    return ``;
  }
};

export default function DashboardNavbarItem({ item }) {
  return (
    <li>
      {item.sub != undefined && item.show && (
        <Link to={item.path} className={`waves-effect ${isActive(item.path)}`}>
          <i className={item.icon}></i> {item.title}
          <span class="fa arrow"></span>
        </Link>
      )}
      {item.sub == undefined && item.show && (
        <Link to={item.path} className={`waves-effect ${isActive(item.path)}`}>
          <i className={item.icon}></i> {item.title}
        </Link>
      )}

      {item.sub != undefined && (
        <ul className={`nav nav-second-level collapse`}>
          {item.sub.map(
            navItem =>
              navItem.show && (
                <li>
                  <Link
                    to={navItem.path}
                    className={`waves-effect ${isActiveSub(navItem.path)}`}
                  >
                    <i className={navItem.icon}></i> {navItem.title}
                  </Link>
                </li>
              )
          )}
        </ul>
      )}
    </li>
  );
}
