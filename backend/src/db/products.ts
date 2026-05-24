import pool from "./setupDB";


export async function fetchProducts(userId:string) {
    const { rows } = await pool.query(`SELECT * FROM product`)
    return rows;
}

export async function fetchProduct(productId: string) {
    const { rows } = await pool.query('SELECT * FROM product WHERE product_id = $1', [
        productId
    ])
    return rows
}

export async function getFavoritesCount(userId:string){
    const { rows } = await pool.query(`SELECT COUNT(*) FROM favorites WHERE user_id = $1`,[userId]);
    return rows[0].count;
}

export async function getProductCount(userId:string){
let data = await pool.query('select attributes.display_name from user_preferences join attributes on user_preferences.attribute_id= attributes.attribute_id where user_preferences.user_id = $1',[userId])  
  const condition = data.rows.map((tag) => `clean_tags ilike '%${tag.display_name}%'`)
  const whereClause = condition.join(' or ')
  const query = 'select COUNT(*) from product where '+whereClause
const products = await pool.query(query)
return products.rows[0].count;
}

export async function getReviewLaterCount(userId:string){
    const { rows } = await pool.query(`SELECT COUNT(*) FROM review_later WHERE user_id = $1`,[userId]);
    return rows[0].count;
}

export async function getNotInterestedCount(userId:string){
    const { rows } = await pool.query(`SELECT COUNT(*) FROM exclusion_list WHERE user_id = $1`,[userId]);
    return rows[0].count;
}

export async function getRatingsCount(userId:string){
    const { rows } = await pool.query(`SELECT 
    rating,
    COUNT(*) AS count,
    AVG(rating) as average_rating
    FROM user_interaction
    WHERE user_id = $1
    GROUP BY rating
    ORDER BY rating DESC;`,[userId]);
          const { rows: avgRows } = await pool.query(
    `SELECT AVG(rating)::numeric(10,2) AS average_rating
     FROM user_interaction
     WHERE user_id = $1 AND rating IS NOT NULL`,
    [userId]
  );

    return {
        rows,
        averageRating: avgRows[0]?.average_rating || 0
    };
}
