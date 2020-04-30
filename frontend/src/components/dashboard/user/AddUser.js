import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { ApiCall } from "./../../../services/NetworkLayer";

const $ = window.$;

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      enableSubmit: false,
      enablePassword: false
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
    if (field == "username" || field == "email") {
      setTimeout(() => {
        this.checkUserExist();
      }, 100);
    }
  };

  addUser = event => {
    event.preventDefault();
    let history = this.props.history;
    ApiCall().authorized(
      {
        method: "POST",
        url: "/users",
        data: {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        }
      },
      response => {
        if (response.status == 422) {
          return;
        }
        this.setState({
          username: "",
          password: "",
          email: "",
          enableSubmit: false,
          enablePassword: false
        });
        $("#alerttopright")
          .fadeToggle(350)
          .delay(3000)
          .fadeToggle(350);
      },
      error => {
        console.log(error.response);
      }
    );
  };

  checkUserExist = () => {
    this.setState({ enablePassword: false, enableSubmit: false });
    ApiCall().authorized(
      {
        method: "POST",
        url: "/users/check-exist",
        data: {
          username: this.state.username,
          email: this.state.email
        }
      },
      response => {
        if (response.data.length > 0) {
          this.setState({ enablePassword: false, enableSubmit: true });
        } else {
          this.setState({ enablePassword: true, enableSubmit: true });
        }
      },
      error => {
        console.log(error.response);
      }
    );
  };

  render() {
    return (
      <AuthComponent>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Add User</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={event => this.addUser(event)}
                >
                  <div class="form-group">
                    <label class="col-md-12">Username</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.username}
                        onChange={event => this.updateForm(event, "username")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">E-mail</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.email}
                        onChange={event => this.updateForm(event, "email")}
                      />
                    </div>
                  </div>
                  {this.state.enablePassword && (
                    <div class="form-group">
                      <label class="col-md-12">Password</label>
                      <div class="col-md-12">
                        <input
                          type="text"
                          class="form-control form-control-line"
                          value={this.state.password}
                          onChange={event => this.updateForm(event, "password")}
                        />
                      </div>
                    </div>
                  )}
                  {this.state.enableSubmit && (
                    <button
                      type="submit"
                      class="btn btn-info waves-effect waves-light"
                    >
                      Submit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
