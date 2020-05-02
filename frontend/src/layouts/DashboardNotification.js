import React, { Component } from "react";

const $ = window.$;

export default class DashboardNotification extends Component {
  componentDidMount() {}
  closeModal = () => {
    $("#alerttopright").fadeToggle(350);
  };
  render() {
    return (
      <>
        <div
          id="alerttopright"
          class="myadmin-alert myadmin-alert-img alert3 myadmin-alert-top-right"
        >
          <img
            src="https://cdn3.iconfinder.com/data/icons/line-icons-medium-version/64/bell-512.png"
            class="img"
            alt="img"
          />
          <a onClick={() => this.closeModal()} class="closed" marked="1">
            ×
          </a>
          <h4 id="alerttoprightTitle">Success</h4>
          <p id="alerttoprightBody">
            <b>Update</b> went successfull.
          </p>
        </div>
      </>
    );
  }
}
