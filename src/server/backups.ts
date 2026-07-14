import fs from "node:fs";
import dayjs from "dayjs";
import { BACKUP_DIR } from "./config";
import { ItemModel } from "./models";

// try to do the backup in every hour.
// only the daily first will be saved.
const INTERVAL = 1000 * 60 * 60;

const backup = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const filename = `${BACKUP_DIR}/${today}.json`;
  if (fs.existsSync(filename)) {
    console.log("[Backup] Already backed up today.");
    return;
  }
  console.log("[Backup] Backing up...");
  ItemModel.find()
    .then((items) => {
      fs.writeFile(filename, JSON.stringify(items, null, 4), (err) => {
        if (err) throw err;
        console.log(`[Backup] Backed up to ${filename}`);
      });
      return undefined;
    })
    .catch((err: unknown) => {
      console.error("[Backup]", err);
      throw err;
    });
};

export const startPeriodicBackups = () => {
  backup();
  setTimeout(backup, INTERVAL);
};
