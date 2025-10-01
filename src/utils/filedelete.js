const fs = require("fs").promises;
const path = require("path");

async function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath); // or adjust base dir accordingly
    await fs.unlink(fullPath);
    console.log("File deleted:", fullPath);
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
}

module.exports = deleteFile;
