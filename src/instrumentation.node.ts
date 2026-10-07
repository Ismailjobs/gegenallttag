import { bootstrapDatabase } from "./lib/bootstrap";
import { startScheduler } from "./lib/scheduler";

bootstrapDatabase()
  .then(() => startScheduler())
  .catch((error) => {
    console.error("[bootstrap]", error);
  });
