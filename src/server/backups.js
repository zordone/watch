const api = require("./api");

// try to do the backup in every hour.
// only the daily first will be saved.
const INTERVAL = 1000 * 60 * 60;

const backup = () => {
  api.adminBackup({ isAutoBackup: true });
  setTimeout(backup, INTERVAL);
};

exports.startPeriodicBackups = backup;
