export const taskStatus = ["Ready", "Started", "InProgress", "Done"];

export const filterTaskStatus = data => {
  data.map(d => {
    d.status = taskStatus[d.status];
  });
  return data;
};
