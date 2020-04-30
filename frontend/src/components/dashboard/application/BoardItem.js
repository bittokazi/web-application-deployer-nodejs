import React from "react";

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  //   background: isDragging ? "lightgreen" : "none",
  ...draggableStyle
});

export default function BoardItem({ provided, snapshot, item }) {
  return (
    <div
      class="panel panel-primary"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    >
    {/* <div> */}
      <div class="panel panel-primary">
        <div class="panel-heading">{item.name}</div>

        <div class="panel-wrapper collapse in" aria-expanded="true">
          {item.description && (
            <div class="panel-body">
              <p>{truncateString(item.description, 20)}</p>
            </div>
          )}
          {item.project && <div class="panel-footer">{item.project.title}</div>}
        </div>
      </div>
    </div>
  );
}
