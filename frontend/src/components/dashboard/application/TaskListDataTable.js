import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import EditTaskModal from "./EditTaskModal";
import { taskStatus } from "../../../utils/TaskStatus";

const FilterComponent = ({
  filterText,
  onFilter,
  onClear,
  projects,
  onProjectChange,
  onStatusChange,
}) => {
  return (
    <>
      <div class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">Search Title</label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              placeholder="Filter By Title"
              value={filterText}
              onChange={onFilter}
            />
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Select Project</label>
          <div class="col-sm-10">
            <select class="form-control" onChange={onProjectChange}>
              <option value="">All</option>
              {projects.map((project) => {
                return <option value={project.id}>{project.title}</option>;
              })}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Select Status</label>
          <div class="col-sm-10">
            <select class="form-control" onChange={onStatusChange}>
              <option value="">All</option>
              {taskStatus.map((status, index) => {
                return <option value={index}>{status}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export const TaskListDataTable = ({
  applications,
  projectList,
  boardList,
  userList,
  mainState,
}) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskForEdit, setTaskForEdit] = useState({});
  const filteredItems = applications.filter(
    (item) =>
      item.name &&
      item.name.includes(filterText) &&
      ((item.projectid && project == "") ||
        (item.projectid && item.projectid == project)) &&
      (status == "" || item.status == status)
  );
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };
  const handleEdit = (id) => {
    setShowModal(true);
    applications.map((task) => {
      if (task.id == id) {
        setTaskForEdit(task);
        return;
      }
    });
  };
  const columns = [
    {
      name: "Title",
      selector: "name",
      sortable: true,
    },
    {
      name: "Project",
      selector: "project.title",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => <div>{taskStatus[row.status]}</div>,
      sortable: true,
    },
    {
      name: "Board",
      cell: (row) => <div>{row.board != null && row.board.title}</div>,
      sortable: true,
    },
    {
      name: "Edit",
      cell: (row) => (
        <div>
          <i className=" ti-pencil " onClick={() => handleEdit(row.id)}></i>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent
        selectableRows
        persistTableHead
      />
      <Modal
        isOpen={showModal}
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            width: "600px",
            marginLeft: "-300px",
            height: "600px",
            marginTop: "-300px",
          },
        }}
        shouldCloseOnOverlayClick={false}
        contentLabel="Minimal Modal Example"
      >
        <EditTaskModal
          task={taskForEdit}
          closeModal={setShowModal}
          projects={projectList}
          boards={boardList}
          users={userList}
          mainState={mainState}
        />
      </Modal>
    </>
  );
};

export default TaskListDataTable;
