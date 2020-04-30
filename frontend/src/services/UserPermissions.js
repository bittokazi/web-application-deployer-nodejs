import BackendMapping from "./../mapping/BackendMapping";

export const UserPermissions = [
  {
    role: "superAdmin"
  },
  {
    role: "owner",
    allow: [BackendMapping.userProfile]
  },
  {
    role: "manager"
  },
  {
    role: "user"
  }
];
