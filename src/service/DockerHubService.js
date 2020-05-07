import request from "request";

export const dockerCheckBuildStatus = (url) => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          "Content-Type": "application/json",
        },
        uri: url,
        body: JSON.stringify({
          state: "success",
          context: "Deployed Successfully",
        }),
        method: "POST",
      },
      (err, res, body) => {
        if (!err) {
          return resolve({});
        } else {
          return reject({
            error: "error occured",
          });
        }
      }
    );
  });
};
