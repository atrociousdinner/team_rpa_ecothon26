import pool from './setupDB'

export async function getEcoScore(userId:string){
    const {rows} = await pool.query(`
      SELECT 
        CASE 
          WHEN p.ecoscore >= 90 THEN '90-100'
          WHEN p.ecoscore >= 80 THEN '80-89'
          WHEN p.ecoscore >= 70 THEN '70-79'
          WHEN p.ecoscore >= 60 THEN '60-69'
          ELSE '<60'
        END AS range,
        CASE 
          WHEN p.ecoscore >= 90 THEN 'Excellent'
          WHEN p.ecoscore >= 80 THEN 'Very Good'
          WHEN p.ecoscore >= 70 THEN 'Good'
          WHEN p.ecoscore >= 60 THEN 'Fair'
          ELSE 'Poor'
        END AS label,
        COUNT(*) AS count,
        ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM favorites f2 
                               JOIN product p2 ON f2.product_id = p2.product_id 
                               WHERE f2.user_id = $1), 0)), 0) AS percentage
      FROM favorites f
      JOIN product p ON f.product_id = p.product_id
      WHERE f.user_id = $1 AND p.ecoscore IS NOT NULL
      GROUP BY 
        CASE 
          WHEN p.ecoscore >= 90 THEN '90-100'
          WHEN p.ecoscore >= 80 THEN '80-89'
          WHEN p.ecoscore >= 70 THEN '70-79'
          WHEN p.ecoscore >= 60 THEN '60-69'
          ELSE '<60'
        END,
        CASE 
          WHEN p.ecoscore >= 90 THEN 'Excellent'
          WHEN p.ecoscore >= 80 THEN 'Very Good'
          WHEN p.ecoscore >= 70 THEN 'Good'
          WHEN p.ecoscore >= 60 THEN 'Fair'
          ELSE 'Poor'
        END
      ORDER BY MIN(p.ecoscore) DESC;
    `,[userId]);

    return rows;
}

export async function getActivity(userId:string){
    const {rows} = await pool.query(`
      SELECT 
        TO_CHAR(months.month, 'YYYY-MM') AS date,
        COALESCE(favorited_data.favorited, 0) AS favorited,
        COALESCE(review_later_data.review_later, 0) AS review_later
      FROM (
        SELECT DATE_TRUNC('month', CURRENT_DATE - (generate_series(0, 5) || ' months')::INTERVAL) AS month
      ) months
      LEFT JOIN (
        -- Get favorited data from favorites table
        SELECT 
          DATE_TRUNC('month', f.created_at) AS month,
          COUNT(DISTINCT f.product_id) AS favorited
        FROM favorites f
        WHERE f.user_id = $1
        GROUP BY DATE_TRUNC('month', f.created_at)
      ) favorited_data ON months.month = favorited_data.month
      LEFT JOIN (
        -- Get review later data from review_later table
        SELECT 
          DATE_TRUNC('month', rl.created_at) AS month,
          COUNT(DISTINCT rl.product_id) AS review_later
        FROM review_later rl
        WHERE rl.user_id = $1
        GROUP BY DATE_TRUNC('month', rl.created_at)
      ) review_later_data ON months.month = review_later_data.month
      ORDER BY months.month;
    `, [userId]);
    return rows;
}

export async function getSustainability(userId:string){
    const {rows} = await pool.query(`
      SELECT 
        a.display_name AS attribute,
        true AS preference,
        COUNT(DISTINCT p.product_id) AS productsFound,
        CASE 
          WHEN COUNT(DISTINCT p.product_id) > 15 THEN 'High'
          WHEN COUNT(DISTINCT p.product_id) > 8 THEN 'Medium'
          ELSE 'Low'
        END AS priority
      FROM user_preferences up
      JOIN attributes a ON up.attribute_id = a.attribute_id
      LEFT JOIN product_sustainability ps ON a.attribute_id = ps.attribute_id
      LEFT JOIN product p ON ps.product_id = p.product_id
      LEFT JOIN favorites f ON p.product_id = f.product_id AND f.user_id = up.user_id
      WHERE up.user_id = $1
      GROUP BY a.attribute_id, a.display_name
      ORDER BY COUNT(DISTINCT p.product_id) DESC;
    `,[userId]);
    return rows;
}