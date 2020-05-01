import UserRole from "./UserRole";
import ResoucePathGenerator from "./../utils/ResoucePathGenerator";

export const UserAccess = (role, req) => {
  let menu;
  if (role == UserRole.superAdmin) {
    let userPaths = ResoucePathGenerator("/dashboard", "users");
    let applicationPaths = ResoucePathGenerator("/dashboard", "applications");

    menu = {
      path: `/dashboard`,
      title: `Dashboard`,
      sub: [
        {
          path: `/dashboard`,
          title: `Dashboard`,
          show: false,
          breadcrumb: true,
          icon: `glyphicon glyphicon-fire`,
        },
        {
          path: `/dashboard/applications`,
          title: `Applications`,
          sub: [
            ...applicationPaths,
            {
              path: `/dashboard/applications/deploy/:id`,
              title: `Deploy Application`,
              show: false,
              breadcrumb: true,
              icon: `glyphicon glyphicon-fire`,
            },
          ],
          show: true,
          breadcrumb: true,
          icon: "fa fa-rocket",
        },
        {
          path: `/dashboard/users`,
          title: `Users`,
          sub: userPaths,
          show: true,
          breadcrumb: true,
          icon: `fa fa-users`,
        },
        {
          path: `/dashboard/profile`,
          title: `My Profile`,
          show: true,
          breadcrumb: true,
          icon: `fa fa-user-circle-o`,
        },
        {
          path: `/dashboard/update`,
          title: `Update`,
          show: true,
          breadcrumb: true,
          icon: `glyphicon glyphicon-fire`,
        },
        {
          path: `/dashboard/logout`,
          title: `Logout`,
          show: true,
          breadcrumb: true,
          icon: "fa fa-sign-out",
        },
      ],
      show: true,
      breadcrumb: true,
    };
  }
  return menu;
};

export default UserAccess;
