import Route from "./Route";
import Config from "./../config/Config";
import SequalizeMigration from "./SequalizeMigration";
import SequalizeSeed from "./SequalizeSeed";
import SocketEngine from "./SocketEngine";

let socketIoCallback = {};

export default class Engine {
  constructor(app) {
    this.app = app;
    this.config = Config();
    return this;
  }

  init() {
    SequalizeMigration()
      .then(() => {
        SequalizeSeed()
          .then(() => {
            SequalizeSeed;
            Route(this.app, socketIoCallback);
            this.app = SocketEngine(this.app, (socketIo) => {
              socketIoCallback = socketIoCallback["socket"] = socketIo;
            });
            this.app.listen(this.config._PORT, () =>
              console.log(
                `Deployment + server running on port ${this.config._PORT}!`
              )
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
