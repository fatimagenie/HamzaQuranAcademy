const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

function read() {
  if (!fs.existsSync(DB_FILE)) {
    const empty = { students: [], fees: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

function write(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
