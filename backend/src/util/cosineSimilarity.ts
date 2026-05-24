import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import pool from "../db/setupDB";
import productIntoDatabase from "./productIntoDatabase";
import generateDescription from "./generateDescription";

const execFileAsync = promisify(execFile)

const cosineSimilarity = async (tags: string):Promise<any> => {
  try {
    const scriptPath = path.join(__dirname, "../model/cosineSimilarity.py")
    const csvPath = path.join(__dirname, "../model/data_with_new_eco_score.csv")

    const result: any = await execFileAsync("python3", [scriptPath, tags, csvPath])
    const parsed = JSON.parse(result.stdout)
    let products = parsed.recommendations.map((recommendation: any) => { return { ...recommendation, description: null }})

    console.log(`${products.length} products fetched using cosine similarity`)

    if(products.length)
    {
      products = await Promise.all(
        products.map(async(product: any) => {
          const productInDB = await pool.query(
            "Select * from product where product_id = $1",
            [product.code]
          )

          productInDB.rows.length > 0 ? console.log("Description found in database") : console.log("Description not found in database")

          const description = productInDB.rows.length > 0 ? productInDB.rows[0].description : await generateDescription(product.tags);
          return {...product, description: description}
        })
      );

      (async () => {
        console.log("...inserting recommended products into database in background...")
        products.forEach(async(product: any) => 
          await productIntoDatabase(product)  
        )
      })();

      return products.map((product: any) => {
        return {
          code: product.code,
          product_name: product.product_name,
          description: product.description,
          brands: product.brands,
          clean_tags: product.tags,
          image_url: product.image_url,
          eco_score: product.eco_score
        }
      });
    }

    return [];
  }
  catch(err) {
    console.error("Error implementing cosine similarity: ", err)
  }
};

export default cosineSimilarity
