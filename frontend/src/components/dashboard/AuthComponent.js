import React, { useContext, Component } from "react";
import { withRouter } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import { UserInfoContext } from "./../../providers/UserInfoProvider";
import AuthStore from "./../../services/AuthStore";

let $ = window.$;

export class AuthComponent extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);
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
        console.log("ffffffffff", resolve);

        if (!this.checkPageAccess(resolve.data.access)) {
          history.push("/dashboard");
          return;
        }
        this.context.setUser(resolve.data);
        setTimeout(() => {
          $(function () {
            $(".preloader").fadeOut();
            $("#side-menu").metisMenu();
            $("body").trigger("resize");
          });
        }, 1000);
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
    return <div id="page-wrapper">{this.props.children}</div>;
  }
}

export default withRouter(AuthComponent);
