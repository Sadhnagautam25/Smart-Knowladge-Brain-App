import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { startResurfaceJob } from "./src/cron/resurfaceJob.js";

const PORT = 3000;

const startServer = async () => {
  try {
    // DB connect
    await connectToDB();
    startResurfaceJob();

    // Server start only after DB success
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} ✅`);
    });
  } catch (error) {
    console.error("Failed to start server ❌", error.message);
    process.exit(1); // force stop if something breaks
  }
};

startServer();
