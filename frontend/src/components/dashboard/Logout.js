import React, { useContext } from "react";
import AuthStore from "./../../services/AuthStore";
import { useHistory } from "react-router-dom";
import { UserInfoContext } from "./../../providers/UserInfoProvider";
import { removeFirebaseNotification } from "../../services/firebase";

export default function Logout() {
  const userContext = useContext(UserInfoContext);
  userContext.chat.disconnect();
  userContext.chat.connectChat = false;
  userContext.setFcmsubscribe(null);

  let history = useHistory();

  removeFirebaseNotification().then(() => {
    AuthStore().saveTenantKey(null);
    AuthStore().saveClientCredentials(null);
    AuthStore().saveOauthToken(null);
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    history.push("/");
  });

  return <div></div>;
}
