const { spawn } = require("child_process");
const fs = require("fs");

if (fs.existsSync(__dirname + "/complete-log.txt")) {
  console.log("Already setup");
  process.exit();
} else {
  fs.writeFileSync(__dirname + "/complete-log.txt", "setup complete");
}

const seeder = spawn("npm", ["run", "seed:all"]);
const fieldManager = spawn("node", ["setup-scripts/field/fields-manager.js"]);

seeder.stdout.on("close", () => {
  console.log("seed completed");
});

fieldManager.stdout.on("error", (err) => {
  console.log(err);
});

fieldManager.stdout.on("close", () => {
  console.log("Fields moved");
});
