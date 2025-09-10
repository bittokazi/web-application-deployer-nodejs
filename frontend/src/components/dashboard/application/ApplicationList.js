import React, { useState, Component } from "react";
import { ApiCall } from "../../../services/NetworkLayer";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { Link } from "react-router-dom";

export default class ApplicationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
    };
  }
  componentDidMount() {}

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/api/applications",
      },
      (response) => {
        this.setState({ applications: response.data });
        response.data.forEach((application, index) => {
          if (application.healthUrl)
            this.getHealthStatus(index, application.healthUrl);
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

  getHealthStatus(index, url) {
    if (url && url != "") {
      fetch(`${url}`, {
        method: "GET",
      }).then((response) => {
        if (response.ok) {
          if (response.status >= 200 || response.status >= 300) {
            this.state.applications[index].isOnline = true;
            this.setState({
              applications: this.state.applications,
            });
          } else {
            this.state.applications[index].isOnline = false;
            this.setState({
              applications: this.state.applications,
            });
          }
        } else {
          this.state.applications[index].isOnline = false;
          this.setState({
            applications: this.state.applications,
          });
        }
      });
    }
  }

  deploy = (id) => {
    console.log(id);

    ApiCall().authorized(
      {
        method: "GET",
        url: "/api/applications/" + id,
      },
      (response) => {
        // this.setState({ applications: response.data });
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Application List</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Health Status</th>
                        <th>Deploying</th>
                        <th>Deploy</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.applications.map((application) => {
                        return (
                          <tr>
                            <td>{application.id}</td>
                            <td>{application.name}</td>
                            <td>
                              {application.isOnline != undefined &&
                                application.isOnline && (
                                  <div class="health-online"></div>
                                )}
                              {application.isOnline != undefined &&
                                !application.isOnline && (
                                  <div class="health-offline"></div>
                                )}
                              {application.isOnline == undefined && (
                                <div class="health-error"></div>
                              )}
                            </td>
                            <td>
                              {application.isDeploying && (
                                <div
                                  style={{
                                    float: "left",
                                    "margin-left": "14px",
                                  }}
                                  class="cssload-speeding-wheel"
                                ></div>
                              )}
                              {!application.isDeploying && <>No</>}
                            </td>
                            <td>
                              <Link
                                to={`/dashboard/applications/deploy/${application.id}`}
                              >
                                Deploy
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`/dashboard/applications/edit/${application.id}`}
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
