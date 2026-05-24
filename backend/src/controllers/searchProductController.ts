import { Response } from "express";
import pool from "../db/setupDB";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { CustomRequest } from "../@types/express";
import productIntoDatabase from "../util/productIntoDatabase";
import generateDescription from "../util/generateDescription";
import productIntoDataset from "../util/productIntoDataset";
import cosineSimilarity from "../util/cosineSimilarity";
import searchIntoDatabase from "../util/searchIntoDatabase";

const execFileAsync = promisify(execFile);

const searchProductController = async (
  req: CustomRequest,
  res: Response
):Promise<any> => {
  try {
    const userId = req.findUser?.userId;
    const { type, data } = req.body.input;

    let tags: string = "";

    if (type === "barcode") {
      console.log("\nBarcode Scanned: ", data)
      console.log("...searching scanned product in database...")
      const product = await pool.query(
        "Select * FROM product WHERE product_id = $1",
        [data]
      );
      if (product.rows.length > 0) {
        console.log("Scanned product found in database with tags: ", product.rows[0].clean_tags)
        tags = product.rows[0].clean_tags;
      } else {
        console.log("Scanned product not found in database") 
        console.log("...searching scanned product in dataset...")

        const scriptPath = path.join(__dirname, "../model/barcodeSearch.py");
        const csvPath = path.join(
          __dirname,
          "../model/data_with_new_eco_score.csv"
        );

        const result: any = await execFileAsync(
          "python3",
          [scriptPath, data, csvPath]
        );
        
        const parsed = JSON.parse(result.stdout)
        
        if (parsed.found) {
          const product = parsed.product
          console.log("Scanned product found in dataset with tags: ", product.tags)
          tags = product.tags;

          //In background, generate the description and store it in database for future use
          (async () => {
            console.log("...generating description for scanned product in background...")
            const description = await generateDescription(tags)
            console.log("...storing scanned product from dataset to database in background...")
            await productIntoDatabase({ ...product, description })  
          })();
        } 
        else {
          console.log("Scanned product not found in dataset")
          console.log("...searching scanned product in openfoodfacts using api...")

          const fetchedResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)

          if(!fetchedResponse.ok) {
            console.error("Error fetching scanned product using api")
            return res
              .status(500)
              .json({ error: "Error fetching scanned product using api", products: [] });
          }

          const fetchedProduct = await fetchedResponse.json()

          if(fetchedProduct.status) {

            const product = {
              code: fetchedProduct.code,
              product_name: fetchedProduct.product.product_name || fetchedProduct.code,
              brands: fetchedProduct.product.brands,
              image_url: fetchedProduct.product.image_url,
              tags: fetchedProduct.product._keywords.join(" "),
              eco_score: null
            };
            console.log("Scanned product found in openfoodfacts using api with tags: ", product.tags);
            tags = product.tags;

            //In backrgound, generate eco score and store it in dataset also generate description and store it in database
            (async () => {
              console.log("...generating eco score of scanned product in background...")
              const scoreResponse = await fetch(`http://localhost:${process.env.PORT}/api/get_eco_score`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  tags: tags.toLowerCase().replace(/,/g, " ").split(/\s+/).map(tag => ({ name: tag, value: null })),
                }),
              });

              const score = await scoreResponse.json();
              console.log("Eco score generated for scanned product: ", score.ecoScore)
              product.eco_score = score.ecoScore

              console.log("...storing scanned product from openfoodfacts to dataset in background...")
              await productIntoDataset(product)

              console.log("...generating description of scanned product in background...")
              const description = await generateDescription(tags)

              console.log("...storing scanned product from openfoodfacts to database in background...")
              await productIntoDatabase({ ...product, description })
            })();
          }
          else {
            console.log("Scanned product not found in openfoodfacts using api")
            return res
              .status(200)
              .json({ message: "Scanned product not found", products: [] });
          }
        }
      }
    } else if (type === "prompt") {
      tags = data;
    } else {
      return res.status(400).json({
        message: "Input method is invalid",
        products: [],
      });
    }

    if(tags.trim())
    {
      // const response = await fetch(
      //   `http://localhost:${process.env.PORT}/api/recommend`,
      //   {
      //     method: "POST",
      //     headers: { "Content-type": "application/json" },
      //     body: JSON.stringify({ tags }),
      //   }
      // );

      // const { recommendations } = await response.json();
      
      // Insert recommended products into DB
      // for (const recommendation of recommendations) {
      //   await pool.query(
      //     `INSERT INTO product VALUES ($1, $2, $3, $4, $5, $6, $7)
      // ON CONFLICT (product_id) DO NOTHING`,
      //     [
      //       recommendation.code,
      //       recommendation.product_name,
      //       recommendation.description,
      //       recommendation.brands,
      //       recommendation.clean_tags,
      //       recommendation.image_url,
      //       recommendation.eco_score,
      //     ]
      //   );
      // }
      //
      // res.status(200).json({
      //   message: "Products fetched successfully",
      //   products: recommendations.sort((a: any, b: any) => {
      //     return b.eco_score - a.eco_score
      //   }),
      // });

      console.log("...storing search input into database in background...");
      (async() => {
        await searchIntoDatabase({ 
          user_id: userId,
          type: type,
          input: tags.trim() 
        })
      })();
     
      console.log("...implementing cosine similarity to get searched products...")
      const recommendations = await cosineSimilarity(tags.trim()) 
      return res.status(200).json({
        message: "Products fetched successfully",
        products: recommendations.sort((a: any, b: any) => {
          return b.eco_score - a.eco_score
        }),
      });
    }

    return res.status(200).json({
      message: "Tags are empty",
      products: [],
    });

  } catch (error) {
    console.error("Error in searching products: ", error);
  }
};

export default searchProductController;
