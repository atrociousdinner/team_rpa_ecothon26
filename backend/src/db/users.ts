import pool from "./setupDB";

export async function getUserByEmail(email: string) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows;
}

export async function createNewUser(
  userId: string,
  name: string,
  email: string,
  hashedPassword: string,
  dateOfBirth: string,
  gender: string,
  photo_url: string
) {
  return await pool.query(
    "INSERT INTO users (id, name, email, hashed_password, DOB, gender, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [userId, name, email, hashedPassword, dateOfBirth, gender, photo_url]
  );
}

export async function setUserPhotoUrl(photo_url: string, email: string) {
  return await pool.query(`UPDATE users SET photo_url=$1 WHERE email = $2`, [
    photo_url,
    email,
  ]);
}

export async function updateUserName(userId: string, displayName: string) {
  return pool.query("UPDATE users SET name = $1 WHERE id = $2", [
    displayName,
    userId,
  ]);
}

export async function updateUserGender(userId: string, gender: string) {
  return pool.query("UPDATE users SET gender = $1 WHERE id = $2", [
    gender,
    userId,
  ]);
}

export async function updateUserDob(userId: string, dob: string) {
  return pool.query("UPDATE users SET dob = $1 WHERE id = $2", [dob, userId]);
}

export async function getUserHashedPassword(userId: string) {
  const result = await pool.query(
    "SELECT hashed_password FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.hashed_password;
}

export async function updateUserPassword(
  userId: string,
  hashedPassword: string
) {
  return pool.query("UPDATE users SET hashed_password = $1 WHERE id = $2", [
    hashedPassword,
    userId,
  ]);
}
