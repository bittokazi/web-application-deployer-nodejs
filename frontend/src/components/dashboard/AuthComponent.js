import React, { useContext, Component } from "react";
import { withRouter } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import { UserInfoContext } from "./../../providers/UserInfoProvider";
import AuthStore from "./../../services/AuthStore";
import { askForPermissioToReceiveNotifications } from "../../services/firebase";

let $ = window.$;

export class AuthComponent extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);
    this.state = {
      hasPermission: false,
      loading: true,
    };
  }

  checkPageAccess(menu) {
    let currentPath = window.location.pathname.split("/");
    let found = true;
    if (currentPath.length != menu.path.split("/").length) {
      found = false;
    } else {
      let index = 0;
      menu.path.split("/").forEach((element) => {
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
      return true;
    } else {
      if (menu.sub) {
        for (let i = 0; i < menu.sub.length; i++) {
          if (this.checkPageAccess(menu.sub[i])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  componentDidMount() {
    let history = this.props.history;
    if (AuthStore().getOauthToken() == null) {
      history.push("/");
      return;
    }
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users/whoami",
      },
      (resolve) => {
        if (resolve.data.changePassword) {
          history.push("/");
        }
        if (!this.context.fcmsubscribe) {
          askForPermissioToReceiveNotifications();
          this.context.setFcmsubscribe(true);
        }
        if (!this.checkPageAccess(resolve.data.access)) {
          this.setState({ loading: false });
          setTimeout(() => {
            $(function () {
              $(".preloader").fadeOut();
              $("#side-menu").metisMenu();
              $("body").trigger("resize");
            });
          }, 1000);
        } else {
          this.setState({ hasPermission: true, loading: false });
          setTimeout(() => {
            $(function () {
              $(".preloader").fadeOut();
              $("#side-menu").metisMenu();
              $("body").trigger("resize");
            });
          }, 1000);
        }
        this.context.setUser(resolve.data);

        if (this.props.authSuccess) {
          this.context.chat.connectChat = true;
          this.props.authSuccess(resolve.data);
          this.context.chat.connectChatComponent();
        }
      },
      (reject) => {
        history.push("/");
      }
    );
  }

  render() {
    return (
      <div id="page-wrapper">
        {!this.state.loading && this.state.hasPermission && this.props.children}
        {!this.state.loading && !this.state.hasPermission && (
          <div>403 - Permission Denied</div>
        )}
      </div>
    );
  }
}

export default withRouter(AuthComponent);
