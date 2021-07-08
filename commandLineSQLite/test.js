const sqlite3 = require("sqlite3").verbose();
const util = require("util");

async function getDB() {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database("./project.db", err => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log("Connected to the project database.");
        resolve(db);
      }
    });
  });
}

try {
  // run these statements once to set up the db
  let db = await getDB();
  db.run(
    `CREATE TABLE services(id INTEGER PRIMARY KEY, service text, date text)`
  );
  db.run(
    `INSERT INTO services(id, service, date) VALUES (1, 'blah', '01-23-1987')`
  );
} catch (err) {
  console.log(err);
}

const db = (async () => await getDB());
const dbGetAsync = util.promisify(db.get);

async function get(service) {
  let sql = `SELECT Id id, Service service, Date date FROM services WHERE service  = ?`;

  try {
    const row = await dbGetAsync(sql, [service]);
    let this_row = { row: row.id, service: row.service };
    this_row
      ? console.log(row.id, row.service, row.date)
      : console.log(`No service found with the name ${service}`);
    return row;
  } catch (err) {
    console.error(err.message);
  }
}

let row = await get("blah");

exports.get = get;
