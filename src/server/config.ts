import os from "node:os";

const homeDir = os.homedir();

export const PORT = 3001;
export const DATABASE_URL = "mongodb://127.0.0.1:27017/watch";
export const BACKUP_DIR = `${homeDir}/Documents/watch-db-backups`;
// this was used for the old CSV import. not needed currently.
// will be needed for the planned JSON restore feature.
export const IMPORT_DIR = "";
