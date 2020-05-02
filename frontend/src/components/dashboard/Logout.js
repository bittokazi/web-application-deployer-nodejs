import React, { useContext } from "react";
import AuthStore from "./../../services/AuthStore";
import { useHistory } from "react-router-dom";
import { UserInfoContext } from "./../../providers/UserInfoProvider";
import { removeFirebaseNotification } from "../../services/firebase";

export default function Logout() {
  const userContext = useContext(UserInfoContext);
  userContext.chat.disconnect();
  userContext.chat.connectChat = false;

  let history = useHistory();
  AuthStore().saveTenantKey(null);
  AuthStore().saveClientCredentials(null);
  AuthStore().saveOauthToken(null);
  let f = async () => {
    await removeFirebaseNotification();
    history.push("/");
  };
  f();
  return <div></div>;
}
