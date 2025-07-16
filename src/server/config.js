const homeDir = require("os").homedir();

module.exports = Object.freeze({
  PORT: 3001,
  DATABASE_URL: "mongodb://127.0.0.1:27017/watch",
  BACKUP_DIR: `${homeDir}/Documents/watch-db-backups`,
  // this was used for the old CSV import. not needed currently.
  // will be needed for the planned JSON restore feature.
  IMPORT_DIR: "",
});
