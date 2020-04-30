console.log("Self deploy started...");

var exec = require("child_process").exec;

setTimeout(() => {
  let bash = exec("bash self_deploy.sh");
  bash.on("exit", function (data) {
    console.log("exit", data.toString());
  });
  bash.stderr.on("data", function (data) {
    console.log("stderr", data.toString());
  });
  bash.stdout.on("data", function (data) {
    console.log("stdout", data.toString());
  });
}, 5000);
