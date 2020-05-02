import Config from "../config/Config";
import request from "request";

export const subscribeTopic = (token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          Authorization: "key=" + Config()._FCM_SERVER_KEY,
          "Content-Type": "application/json",
        },
        uri: "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/all",
        body: JSON.stringify({}),
        method: "POST",
      },
      (err, res, body) => {
        if (!err) {
          return resolve(JSON.parse({}));
        } else {
          return reject({
            error: "error occured",
          });
        }
      }
    );
  });
};

export const unSubscribeTopic = (token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          Authorization: "key=" + Config()._FCM_SERVER_KEY,
          "Content-Type": "application/json",
        },
        uri: "https://iid.googleapis.com/iid/v1:batchRemove",
        body: JSON.stringify({
          to: "/topics/all",
          registration_tokens: [token],
        }),
        method: "POST",
      },
      (err, res, body) => {
        if (!err) {
          return resolve(JSON.parse({}));
        } else {
          return reject({
            error: "error occured",
          });
        }
      }
    );
  });
};

export const sendNotification = (title, body, icon, link) => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          Authorization: "key=" + Config()._FCM_SERVER_KEY,
          "Content-Type": "application/json",
        },
        uri: "https://fcm.googleapis.com/fcm/send ",
        body: JSON.stringify({
          notification: {
            title: title,
            body: body,
            click_action: link,
            icon: icon,
          },
          data: {
            ddd: "dddd",
          },
          to: "/topics/all",
        }),
        method: "POST",
      },
      (err, res, body) => {
        if (!err) {
          return resolve(JSON.parse({}));
        } else {
          return reject({
            error: "error occured",
          });
        }
      }
    );
  });
};
