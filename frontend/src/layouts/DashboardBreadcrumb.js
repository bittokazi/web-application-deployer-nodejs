import React from "react";
import { UserInfoContext } from "./../providers/UserInfoProvider";
import { Link } from "react-router-dom";

const createBreadCrumb = (data, breadcrumb) => {
  let currentPath = window.location.pathname.split("/");
  let found = true;
  if (!data.breadcrumb) {
    found = false;
  }
  if (currentPath.length != data.path.split("/").length) {
    if (!window.location.pathname.includes(data.path)) {
      found = false;
    }
  } else {
    let index = 0;
    data.path.split("/").forEach(element => {
      let allProps = element.match(/\:([^}]+)/g);
      if (!allProps) {
        if (element != currentPath[index]) {
          found = false;
        }
      }
      index++;
    });
  }
  if (found) {
    breadcrumb.push({
      path: data.path,
      title: data.title
    });
  }

  if (data.sub) {
    for (let i = 0; i < data.sub.length; i++) {
      createBreadCrumb(data.sub[i], breadcrumb);
    }
  }
  return breadcrumb;
};

export default function DashboardBreadcrumb() {
  return (
    <UserInfoContext.Consumer>
      {userContextConsumer => (
        <ol class="breadcrumb">
          {userContextConsumer.user != null &&
            createBreadCrumb(userContextConsumer.user.access, []).map(
              (breadcrumb, index) => {
                if (
                  createBreadCrumb(userContextConsumer.user.access, []).length -
                    1 ==
                  index
                ) {
                  document.title = breadcrumb.title;
                  return (
                    <li>
                      <Link className="active" to={window.location.pathname}>
                        {breadcrumb.title}
                      </Link>
                    </li>
                  );
                } else if (index != 0) {
                  return (
                    <li>
                      <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                    </li>
                  );
                }
              }
            )}
        </ol>
      )}
    </UserInfoContext.Consumer>
  );
}
