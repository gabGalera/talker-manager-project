const fs = require('fs').promises;
const path = require('path');

async function readJSON() {
  try {
    const data = await fs.readFile(
      path.resolve(__dirname, '../talker.json'),
      'utf-8',
    );
    console.log(data);
  } catch (err) {
    console.err(err.message);
  }
}

readJSON();