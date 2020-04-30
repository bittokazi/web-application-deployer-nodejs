import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AuthComponent from "../AuthComponent";
import DashboardBreadcrumb from "../../../layouts/DashboardBreadcrumb";
import { ApiCall } from "../../../services/NetworkLayer";
import BoardItem from "./BoardItem";
import SelectSearch from "react-select-search";

const $ = window.$;

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  float: `left`,
  height: `100%`
});

export default class TaskBoard extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    items: [],
    selected: [],
    selected2: [],
    selected3: [],
    boards: [],
    selectedBoard: null,
    allTasks: [],
    users: [],
    projects: [],
    filterProjectId: "",
    filterUserId: "",
    filterBoardId: "",
    tasks: []
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    droppable2: "selected",
    droppable3: "selected2",
    droppable4: "selected3"
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable") {
        state = { items };
      }

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      if (source.droppableId === "droppable3") {
        state = { selected2: items };
      }

      if (source.droppableId === "droppable4") {
        state = { selected3: items };
      }

      this.setState(state);
    } else {
      console.log(this.getList(source.droppableId)[source.index].id);

      let taskId = this.getList(source.droppableId)[source.index].id.split(
        "-"
      )[1];
      if (destination.droppableId == "droppable") {
        //console.log(taskId, "Ready", 1);
        this.updateTask(0, taskId);
      } else if (destination.droppableId == "droppable2") {
        //console.log(taskId, "Ready", 1);
        this.updateTask(1, taskId);
      } else if (destination.droppableId == "droppable3") {
        //console.log(taskId, "In progress", 2);
        this.updateTask(2, taskId);
      } else if (destination.droppableId == "droppable4") {
        //console.log(taskId, "In progress", 2);
        this.updateTask(3, taskId);
      }
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      if (result.droppable) {
        this.setState({
          items: result.droppable
        });
      }
      if (result.droppable2) {
        this.setState({
          selected: result.droppable2
        });
      }
      if (result.droppable3) {
        this.setState({
          selected2: result.droppable3
        });
      }

      if (result.droppable4) {
        this.setState({
          selected3: result.droppable4
        });
      }
    }
  };

  makeDragabeId(items) {
    items.map(item => {
      if (`${item.id}`.split("-").length < 2) {
        item.id = `item-${item.id}`;
      }
    });
    return items;
  }

  filterTaskByStatus(status) {
    let tasks = [];
    this.state.allTasks.map(task => {
      if (task.status == status) {
        tasks.push(task);
      }
    });
    return tasks;
  }

  updateTask(status, id) {
    if (this.state.selectedBoard == null) return;
    ApiCall().authorized(
      {
        method: "POST",
        url: "/tasks/update/board/task",
        data: {
          boardid: this.state.selectedBoard.id,
          status,
          id
        }
      },
      response => {
        $("#alerttopright")
          .fadeToggle(350)
          .delay(3000)
          .fadeToggle(350);
        this.getAllTaskOfBoard();
      },
      error => {
        console.log(error.response);
      }
    );
  }

  getAllBoards() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/boards"
      },
      response => {
        this.setState({ boards: response.data });
        this.setState({ selectedBoard: response.data[0] });
        this.getAllTaskOfBoard();
      },
      error => {
        console.log(error.response);
      }
    );
  }

  getAllTaskOfBoard() {
    ApiCall().authorized(
      {
        method: "GET",
        url: `/boards/${this.state.selectedBoard.id}/tasks`
      },
      response => {
        this.setState({ tasks: response.data });
        this.filterTaskBoard();

        // this.setState({ boards: response.data });
        // this.setState({ selectedBoard: response.data[0] });
      },
      error => {
        console.log(error.response);
      }
    );
  }

  authSuccess() {
    this.getAllBoards();
    ApiCall().authorized(
      {
        method: "GET",
        url: "/projects"
      },
      response => {
        this.setState({ projects: response.data });
      },
      error => {
        console.log(error.response);
      }
    );
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users"
      },
      response => {
        const users = [];
        users.push({ name: `All`, value: `` });
        response.data.map(user => {
          user.name = `${user.firstName} ${user.lastName}(${user.username})`;
          user.value = `${user.id}`;
          users.push(user);
        });
        this.setState({
          users: users
        });
      },
      error => {
        console.log(error.response);
      }
    );
  }

  filterTaskBoard() {
    let filteredTasks = [];
    this.state.tasks.forEach(task => {
      if (
        ((task.projectid && this.state.filterProjectId == "") ||
          (task.projectid && task.projectid == this.state.filterProjectId)) &&
        (this.state.filterUserId == "" ||
          (task.assignee != null && task.assignee == this.state.filterUserId))
      ) {
        filteredTasks.push(task);
      }
    });
    this.setState({ allTasks: filteredTasks });
    this.setState({
      items: this.makeDragabeId(this.filterTaskByStatus(0))
    });
    this.setState({
      selected: this.makeDragabeId(this.filterTaskByStatus(1))
    });
    this.setState({
      selected2: this.makeDragabeId(this.filterTaskByStatus(2))
    });
    this.setState({
      selected3: this.makeDragabeId(this.filterTaskByStatus(3))
    });
    return filteredTasks;
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Task Board</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <div class="form-horizontal">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Select Board</label>
                    <div class="col-sm-10">
                      <select
                        class="form-control"
                        onChange={event => {
                          this.setState({
                            selectedBoard: this.state.boards[event.target.value]
                          });
                          setTimeout(() => {
                            this.getAllTaskOfBoard();
                          }, 100);
                        }}
                      >
                        {this.state.boards.map((project, index) => {
                          return <option value={index}>{project.title}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">
                      Search by Project
                    </label>
                    <div class="col-sm-10">
                      <select
                        class="form-control"
                        onChange={event => {
                          this.setState({
                            filterProjectId: event.target.value
                          });
                          setTimeout(() => {
                            this.filterTaskBoard();
                          }, 300);
                        }}
                      >
                        <option value="">All</option>
                        {this.state.projects.map(project => {
                          return (
                            <option value={project.id}>{project.title}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">
                      Search by Assignee
                    </label>
                    <div class="col-sm-10">
                      <SelectSearch
                        options={this.state.users}
                        value={this.state.filterUserId}
                        onChange={(value, state, props) => {
                          this.setState({ filterUserId: value.value });
                          setTimeout(() => {
                            this.filterTaskBoard();
                          }, 300);
                        }}
                        name="assignee"
                        placeholder="Select Assignee"
                      />
                    </div>
                  </div>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        class="col-md-3"
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        <h2>Ready</h2>
                        {this.state.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <BoardItem
                                provided={provided}
                                snapshot={snapshot}
                                item={item}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        class="col-md-3"
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        <h2>Started</h2>
                        {this.state.selected.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <BoardItem
                                provided={provided}
                                snapshot={snapshot}
                                item={item}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="droppable3">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        class="col-md-3"
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        <h2>In Progress</h2>
                        {this.state.selected2.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <BoardItem
                                provided={provided}
                                snapshot={snapshot}
                                item={item}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="droppable4">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        class="col-md-3"
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        <h2>Done</h2>
                        {this.state.selected3.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <BoardItem
                                provided={provided}
                                snapshot={snapshot}
                                item={item}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
