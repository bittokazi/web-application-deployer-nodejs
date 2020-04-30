import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import Routes from "./../routes/Routes";
import Oauth from "./oauth/Oauth";

export const Route = (app, socketIoCallback) => {
  app.use(morgan("dev"));
  app.use("/uploads", express.static("uploads"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, tenant, x-hub-signature"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  Oauth(app);

  Routes(app, socketIoCallback);

  app.use(serveStatic(__dirname + "/../../spaBuild"));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../spaBuild/index.html"));
  });

  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
};

export default Route;
