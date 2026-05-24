import pool from "../db/setupDB";

const productIntoDatabase = async (product: any): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO product VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (product_id) DO NOTHING`,
      [
        product.code,
        product.product_name,
        product.description,
        product.brands,
        product.tags,
        product.image_url,
        product.eco_score,
      ],
    );
    console.log(`${product.code} product stored into database`)
  } catch (err) {
    console.error("Error in product into database: ", err);
  }
};

export default productIntoDatabase;
