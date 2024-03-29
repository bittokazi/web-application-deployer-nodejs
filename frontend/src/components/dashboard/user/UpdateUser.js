import React, { Component } from "react";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { ApiCall } from "../../../services/NetworkLayer";

const $ = window.$;

export default class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      changePassword: false,
      exists: false,
      errorMessage: "",
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  addUser = (event) => {
    event.preventDefault();
    let history = this.props.history;
    this.setState({
      errorMessage: "",
      exists: false,
    });
    ApiCall().authorized(
      {
        method: "PUT",
        url: "/users/" + this.props.match.params.id,
        data: {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          changePassword: this.state.changePassword,
        },
      },
      (response) => {
        console.log(response);
        if (response.status == 422) {
          return;
        }
        if (response.status == 400) {
          this.setState({
            errorMessage: response.data.message,
            exists: true,
          });
          return;
        }
        $("#alerttopright").fadeToggle(350).delay(3000).fadeToggle(350);
        $("#alerttoprightTitle").text("Success");
        $("#alerttoprightBody").text("User Updated Successfully");
      },
      (error) => {
        console.log(error.response);
        if (error.response.status == 400) {
          this.setState({
            errorMessage: error.response.data.message,
            exists: true,
          });
          return;
        }
      }
    );
  };

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users/" + this.props.match.params.id,
      },
      (response) => {
        console.log(response);
        this.setState({
          username: response.data.username,
          email: response.data.email,
          changePassword: response.data.changePassword,
        });
      },
      (error) => {
        console.log(error.response);
        if (error.response.status == 404) {
          this.setState({
            errorMessage: error.response.data.message,
            exists: true,
          });
          return;
        }
      }
    );
  }

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Update User</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={(event) => this.addUser(event)}
                >
                  <div class="form-group">
                    <label class="col-md-12">Username</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.username}
                        disabled
                        onChange={(event) => this.updateForm(event, "username")}
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
                        onChange={(event) => this.updateForm(event, "email")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Change Password</label>
                    <div class="col-md-12">
                      <select
                        class="form-control form-control-line"
                        value={this.state.changePassword}
                        onChange={(event) =>
                          this.updateForm(event, "changePassword")
                        }
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Password</label>
                    <div class="col-md-12">
                      <input
                        type="password"
                        class="form-control form-control-line"
                        value={this.state.password}
                        onChange={(event) => this.updateForm(event, "password")}
                      />
                    </div>
                  </div>
                  {this.state.exists && (
                    <div style={{ color: "red" }}>
                      {this.state.errorMessage}
                    </div>
                  )}
                  <button
                    type="submit"
                    class="btn btn-info waves-effect waves-light"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
