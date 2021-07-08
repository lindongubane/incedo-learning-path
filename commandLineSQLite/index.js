const { promisify } = require('util');
const sqlite3 = require("sqlite3").verbose();
const myArgs = process.argv.slice(2);

const database = new sqlite3.Database("./controllerDB.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the backend");
});

const run = promisify(database.run.bind(database));
const read = promisify(database.each.bind(database));

createTable().catch(console.error);

switch (myArgs[0]) {
  case "list":
    listController();
    break;
  case "add":
    addController(myArgs[1], myArgs[2]);
    break;
  case "remove":
    removeController(myArgs[1]);
    break;
}

async function createTable(){
  const sql = `CREATE TABLE IF NOT EXISTS Controller (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    SerialNumber TEXT,
    MacAddress TEXT );`;

  await run(sql);
}

function addController(serial, mac) {
  const sql = "INSERT INTO Controller(SerialNumber, MacAddress) VALUES(?,?)";
  const params = [serial, mac];
  database.run(sql, params, (err) => {
    if (err) {
      return console.log(err.message);
    }

    return console.log("Controller added");
  });
}

async function listController(){
  const sql = "SELECT * FROM Controller";
  database.each(sql, (err, row) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`${row.Id} ${row.SerialNumber} ${row.MacAddress}`);
  });

   let me = Promise.all(read(sql));
  // console.log(me);

}

function removeController(macAddress){
  const sql = "DELETE FROM Controller WHERE MacAddress = ?"
  const param = [macAddress];

  database.run(sql, param, (err) => {
    if(err){
      return console.log(err.message);
    }
    return console.log("Controller removed");
  });
}

database.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});
