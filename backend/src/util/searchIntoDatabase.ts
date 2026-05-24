import pool from "../db/setupDB";

const searchIntoDatabase = async (search: any): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO input VALUES ($1, $2, $3)
      ON CONFLICT (user_id, type, input) DO UPDATE SET created_at=CURRENT_TIMESTAMP`,
      [
        search.user_id,
        search.type,
        search.input,
      ],
    );
    console.log(`Search stored into database`)
  } catch (err) {
    console.error("Error in search into database: ", err);
  }
};

export default searchIntoDatabase;
