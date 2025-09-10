import React, { Component } from "react";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { ApiCall } from "../../../services/NetworkLayer";

export default class AddApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      secret: "",
      branch: "",
      script: "",
      env: "",
      healthUrl: "",
      startCommand: "",
      stopCommand: "",
      gitRepoLink: "",
      clone: false,
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  addTask = (event) => {
    event.preventDefault();
    let history = this.props.history;
    if (this.state.name == "") return;
    ApiCall().authorized(
      {
        method: "PUT",
        url: "/api/applications/" + this.props.match.params.id,
        data: {
          name: this.state.name,
          secret: this.state.secret,
          branch: this.state.branch,
          script: this.state.script,
          environments: this.state.env,
          isDeploying: false,
          healthUrl: this.state.healthUrl,
          startCommand: this.state.startCommand,
          stopCommand: this.state.stopCommand,
          gitRepoLink: this.state.gitRepoLink,
          clone: this.state.clone,
        },
      },
      (response) => {
        if (response.status == 200) {
          history.push("/dashboard/applications");
        }
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/api/applications/" + this.props.match.params.id,
      },
      (response) => {
        this.setState({
          name: response.data.name,
          secret: response.data.secret,
          branch: response.data.branch,
          script: response.data.script,
          env: response.data.env,
          healthUrl: response.data.healthUrl,
          startCommand: response.data.startCommand,
          stopCommand: response.data.stopCommand,
          gitRepoLink: response.data.gitRepoLink,
          clone: response.data.clone,
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Edit Application</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={(event) => this.addTask(event)}
                >
                  <div class="form-group">
                    <label class="col-md-12">Name</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.name}
                        onChange={(event) => this.updateForm(event, "name")}
                        disabled
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Secret</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.secret}
                        onChange={(event) => this.updateForm(event, "secret")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Repository Link</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.gitRepoLink}
                        onChange={(event) =>
                          this.updateForm(event, "gitRepoLink")
                        }
                      />
                    </div>
                  </div>
                  {/*<div class="form-group">
                    <label class="col-md-12">Auto Clone</label>
                    <div class="col-md-12">
                      <select
                        class="form-control form-control-line"
                        value={this.state.clone}
                        onChange={(event) => this.updateForm(event, "clone")}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>*/}
                  <div class="form-group">
                    <label class="col-md-12">Branch</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.branch}
                        onChange={(event) => this.updateForm(event, "branch")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Health Check URL</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.healthUrl}
                        onChange={(event) =>
                          this.updateForm(event, "healthUrl")
                        }
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Script</label>
                    <div class="col-md-12">
                      <textarea
                        class="form-control"
                        rows="5"
                        value={this.state.script}
                        onChange={(event) => this.updateForm(event, "script")}
                      ></textarea>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Env</label>
                    <div class="col-md-12">
                      <textarea
                        class="form-control"
                        rows="5"
                        value={this.state.env}
                        onChange={(event) => this.updateForm(event, "env")}
                      ></textarea>
                    </div>
                  </div>
                  {/* <div class="form-group">
                    <label class="col-md-12">Start Command</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.startCommand}
                        onChange={(event) =>
                          this.updateForm(event, "startCommand")
                        }
                      />
                    </div>
                  </div> */}
                  <div class="form-group">
                    <label class="col-md-12">Stop Command</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.stopCommand}
                        onChange={(event) =>
                          this.updateForm(event, "stopCommand")
                        }
                      />
                    </div>
                  </div>
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
