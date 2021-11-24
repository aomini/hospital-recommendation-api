const { spawn, exec } = require("child_process");
const fs = require("fs");

if (fs.existsSync(__dirname + "/complete-log.txt")) {
  console.log("Already setup");
  process.exit();
} else {
  fs.writeFileSync(__dirname + "/complete-log.txt", "setup complete");
}

const seeder = spawn("npm", ["run", "seed:all"]);
// const fieldManager = spawn("node", ["setup-scripts/field/fields-manager.js"]);

seeder.stdout.on("close", () => {
  exec("node setup-scripts/field/fields-manager.js", (err, stdout, stderr) => {
    if (err) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log("seed completed");
});
