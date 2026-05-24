import pool from "./setupDB";

export async function setUserRating(user_id: string, product_id: string, rating: number) {
  return await pool.query(
    `INSERT INTO user_interaction (user_id, product_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET rating = EXCLUDED.rating`,
    [user_id, product_id, rating]
  );
}

// Separate function for viewed/duration only
export async function setUserViewed(user_id: string, product_id: string, duration: number) {
  return await pool.query(
    `INSERT INTO user_interaction (user_id, product_id, duration, viewed)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET
       viewed = COALESCE(user_interaction.viewed, 0) + 1,
       duration = COALESCE(user_interaction.duration, 0) + $3`,
    [user_id, product_id, duration]
  );
}

// export async function setUserInteraction(user_id:string, product_id:string, duration:number, rating:number) {
//   return await pool.query(
//     `INSERT INTO user_interaction (user_id, product_id, duration, viewed, rating)
// VALUES ($1, $2, $3, 1, $4)
// ON CONFLICT (user_id, product_id) 
// DO UPDATE SET
//   viewed = user_interaction.viewed + 1,
//   duration = user_interaction.duration + $3,
//     rating = EXCLUDED.rating;
// `
//   , [user_id, product_id, duration, rating]);
// }

export async function getRating(user_id:string, product_id:string) {
  const result =  await pool.query(
    `Select rating from user_interaction where user_id = $1 and product_id = $2
`
  , [user_id, product_id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].rating
}

// if same user_id and product_id is sent,
// update viewed and duration
// viewed is increased by 1
// duration is increased cumulatively


export async function getAverageViewedDuration(user_id:string){
  const result = await pool.query(
    `SELECT AVG(duration) as average_duration, SUM(viewed)::int as viewed
    FROM user_interaction
    WHERE user_id = $1`
    , [user_id]);
      if (result.rows.length === 0) {
      return {average_duration: 0, viewed: 0};
      }
    return {
      average_duration: result.rows[0].average_duration, 
      viewed: result.rows[0].viewed
    };
}
