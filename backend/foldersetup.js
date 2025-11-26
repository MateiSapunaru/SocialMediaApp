// setup-folders.js
const fs = require("fs");
const path = require("path");

const folders = [
  "src",
  "src/config",
  "src/utils",
  "src/repositories",
  "src/services",
  "src/controllers",
  "src/middlewares",
  "src/routes",
  "src/di"
];

for (const folder of folders) {
  const dir = path.join(__dirname, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${folder}`);
  } else {
    console.log(`⚙️ Already exists: ${folder}`);
  }
}

console.log("\n🎉 Folder structure created successfully!");
