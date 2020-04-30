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
        url: "/applications",
      },
      (response) => {
        this.setState({ applications: response.data });
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

  deploy = (id) => {
    console.log(id);

    ApiCall().authorized(
      {
        method: "GET",
        url: "/applications/" + id,
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
              <h4 class="page-title">Task List</h4>
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
