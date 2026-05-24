import app from './app';
import env from './util/ValidateEnv';
import pool from '../src/db/setupDB';

const port = env.PORT || 6666;

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  });
