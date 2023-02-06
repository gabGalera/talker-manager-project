const fs = require('fs').promises;
const path = require('path');

async function readJSON() {
  try {
    const data = await fs.readFile(
      path.resolve(__dirname, '../talker.json'),
      'utf-8',
    );
    return JSON.parse(data);
  } catch (err) {
    console.err(err.message);
  }
}

async function writeJSON(file) {
  try {
    const data = await readJSON();
    data.push(file);
    await fs.writeFile(
      path.resolve(__dirname, '../talker.json'),
      JSON.stringify(data),
    );
  } catch (err) {
    console.log(err.message);
  }
}

async function updateJSON(file) {
  try {
    await fs.writeFile(
      path.resolve(__dirname, '../talker.json'),
      JSON.stringify(file),
    );
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  readJSON,
  writeJSON,
  updateJSON,
};