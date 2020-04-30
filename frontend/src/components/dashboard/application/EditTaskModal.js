import React, { Component } from "react";
import { ApiCall } from "./../../../services/NetworkLayer";
import SelectSearch from "react-select-search";

const $ = window.$;

export default class EditTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectid: this.props.task.projectid,
      name: this.props.task.name,
      type: this.props.task.type,
      description: this.props.task.description,
      boardid: this.props.task.boardid,
      assignee:
        this.props.task.assignee == null ? "" : `${this.props.task.assignee}`
    };
  }
  addTask = event => {
    event.preventDefault();
    if (this.state.projectid == "") return;
    ApiCall().authorized(
      {
        method: "PUT",
        url: `/tasks/${this.props.task.id}`,
        data: {
          name: this.state.name,
          description: this.state.description,
          type: this.state.type,
          projectid: this.state.projectid,
          boardid: this.state.boardid,
          assignee: this.state.assignee
        }
      },
      response => {
        this.props.mainState.authSuccess();
        this.props.closeModal(false);
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
  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };
  render() {
    return (
      <>
        <form
          class="form-material form-horizontal"
          onSubmit={event => this.addTask(event)}
        >
          <div class="form-group">
            <label class="col-md-12">Title</label>
            <div class="col-md-12">
              <input
                type="text"
                class="form-control form-control-line"
                value={this.state.name}
                onChange={event => this.updateForm(event, "name")}
              />
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-12">Select Project</label>
            <div class="col-sm-12">
              <select
                class="form-control"
                value={this.state.projectid}
                onChange={event => this.updateForm(event, "projectid")}
              >
                <option value="">None</option>
                {this.props.projects.map(project => {
                  return <option value={project.id}>{project.title}</option>;
                })}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-12">Select Board</label>
            <div class="col-sm-12">
              <select
                class="form-control"
                value={this.state.boardid}
                onChange={event => this.updateForm(event, "boardid")}
              >
                <option value={null}></option>
                {this.props.boards.map(board => {
                  return <option value={board.id}>{board.title}</option>;
                })}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-12">Task Type</label>
            <div class="col-sm-12">
              <select
                class="form-control"
                value={this.state.type}
                onChange={event => this.updateForm(event, "type")}
              >
                <option value="1">Feature</option>
                <option value="2">Bug</option>
              </select>
            </div>
          </div>
          <SelectSearch
            options={this.props.users}
            value={this.state.assignee}
            onChange={(value, state, props) => {
              this.setState({ assignee: value.value });
            }}
            name="assignee"
            placeholder="Select Assignee"
          />
          <div class="form-group">
            <label class="col-md-12">Description</label>
            <div class="col-md-12">
              <textarea
                class="form-control"
                rows="5"
                value={this.state.description}
                onChange={event => this.updateForm(event, "description")}
              ></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-info waves-effect waves-light">
            Submit
          </button>
          <button
            type="close"
            class="btn"
            onClick={() => {
              this.props.closeModal(false);
            }}
          >
            Close
          </button>
        </form>
      </>
    );
  }
}
