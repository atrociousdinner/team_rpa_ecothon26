import type { Response } from "express";
import { CustomRequest } from "../@types/express";
import pool from "../db/setupDB";
import natural from "natural";

type Recommendation = {
  code: string;
  product_name: string;
  clean_tags: string;
  brands: string;
  image_url: string;
  eco_score: number;
  description: string;
};

const tokenizer = new natural.WordTokenizer();

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  //fetched all products the database and then calculated the cosine similarity between the user preferences tags and product tags
  //returned all data with sorting and then in frontend displaying randomly on basis of similarity
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export const getSampleProducts = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  try {
    const prefResult = await pool.query(
      `SELECT attributes.display_name AS tag 
       FROM user_preferences 
       JOIN attributes ON user_preferences.attribute_id = attributes.attribute_id 
       WHERE user_preferences.user_id = $1`,
      [userId]
    );
    console.log("User Preference Tags:", prefResult.rows);
    const userTags = prefResult.rows.map((row) => row.tag.toLowerCase());

    if (userTags.length === 0) {
      res.status(404).send({ message: "No user preferences found" });
      return;
    }

    // Get total count of products for pagination
    const totalCountResult = await pool.query("SELECT COUNT(*) FROM product");
    const totalProducts = parseInt(totalCountResult.rows[0].count);

    // Get products with pagination
    const productResult = await pool.query(
      "SELECT * FROM product LIMIT $1 OFFSET $2",
      [limit * 2, offset] // Get more products to ensure we have enough after filtering
    );
    let products = productResult.rows;

    // If we don't have enough products, get all products for similarity calculation
    if (products.length < limit) {
      const allProductsResult = await pool.query("SELECT * FROM product");
      products = allProductsResult.rows;
    }

    const vocabSet = new Set<string>();
    products.forEach((product) => {
      tokenizer
        .tokenize(product.clean_tags?.toLowerCase() || "")
        .forEach((tag: any) => vocabSet.add(tag));
    });
    userTags.forEach((tag) => vocabSet.add(tag));
    const vocab = Array.from(vocabSet);

    const userVec = vocab.map(
      (word) => userTags.filter((tag) => tag === word).length
    );

    const scoredProducts = products.map((product) => {
      const productTags = tokenizer.tokenize(
        product.clean_tags?.toLowerCase() || ""
      );
      const productVec = vocab.map(
        (word) => productTags.filter((tag: any) => tag === word).length
      );
      const similarity = cosineSimilarity(userVec, productVec);
      return { ...product, similarity };
    });

    // Sort by similarity and apply pagination
    const sortedProducts = scoredProducts.sort((a, b) => b.similarity - a.similarity);
    const paginatedProducts = sortedProducts.slice(0, limit);

    // Check if we need to fetch recommendations for insufficient products
    if (paginatedProducts.length < 6 && page === 1) {
      const tagsString = userTags.join(" ");
      
      try {
        const recommendResponse = await fetch(
          `http://localhost:${process.env.PORT}/api/recommend`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: tagsString }),
          }
        );

        const recommendData = await recommendResponse.json();

        // Insert new recommendations
        for (const recommendation of recommendData.recommendations) {
          await pool.query(
            `INSERT INTO product
             VALUES ($1,$2,$3,$4,$5,$6,$7) 
             ON CONFLICT (product_id) DO NOTHING`,
            [
              recommendation.code,
              recommendation.product_name,
              recommendation.description,
              recommendation.brands,
              recommendation.clean_tags,
              recommendation.image_url,
              recommendation.eco_score,
            ]
          );
        }

        // Calculate similarity for new recommendations
        const newRecommendations = recommendData.recommendations.map((product: any) => {
          const productTags = tokenizer.tokenize(
            product.clean_tags?.toLowerCase() || ""
          );
          const productVec = vocab.map(
            (word) => productTags.filter((tag: any) => tag === word).length
          );
          const similarity = cosineSimilarity(userVec, productVec);
          return { 
            ...product, 
            product_id: product.code,
            product_name: product.product_name,
            image_url: product.image_url,
            eco_score: product.eco_score,
            similarity 
          };
        });

        // Combine with existing products and re-sort
        const allProducts = [...paginatedProducts, ...newRecommendations];
        const finalSortedProducts = allProducts
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, limit);

        // Update total count after adding new products
        const updatedCountResult = await pool.query("SELECT COUNT(*) FROM product");
        const updatedTotalProducts = parseInt(updatedCountResult.rows[0].count);
        const hasMore = offset + limit < updatedTotalProducts;

        res.json({
          products: finalSortedProducts,
          hasMore: hasMore,
          page: page,
          totalPages: Math.ceil(updatedTotalProducts / limit),
          totalCount: updatedTotalProducts
        });
        return;
      } catch (recommendError) {
        console.error("Error fetching recommendations:", recommendError);
        // Continue with existing products if recommendation fails
      }
    }

    // Calculate if there are more products
    const hasMore = offset + limit < totalProducts;

    res.json({
      products: paginatedProducts,
      hasMore: hasMore,
      page: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalCount: totalProducts
    });

  } catch (err) {
    console.error("Error in getSampleProducts:", err);
    res.status(500).send({ error: "Internal server error" });
  }
};
// export const getSampleProducts = async (req:CustomRequest,res:Response):Promise<void> => {
//   const userId = req.findUser?.userId

//   let data = await pool.query('select attributes.display_name from user_preferences join attributes on user_preferences.attribute_id= attributes.attribute_id where user_preferences.user_id = $1',[userId])

//   //for the time being, i have just included the products whose tags incldue the preferences but we ought to use a
//   //proper recommendation model :) next week
//   //P.S. the recommendation model needs to randomly recommend products based on the tags, not the same products everytime

//   const condition = data.rows.map((tag) => `clean_tags ilike '%${tag.display_name}%'`)
//   const whereClause = condition.join(' or ')
//   const query = 'select * from product where '+whereClause
//   try{
//     const products = await pool.query(query)
//     if(products.rows.length>=6){
//       res.send(products.rows)
//       return
//     }
//   }catch(err){
//     console.error(err)
//     res.status(500).send(err)
//   }

//   data = await pool.query('select attributes.value from user_preferences join attributes on user_preferences.attribute_id= attributes.attribute_id where user_preferences.user_id = $1',[userId])

//   let tags:string = ''
//   data.rows.forEach(tag => {
//     tags+=tag.value+' '
//   })
//   try{
//     const response = await fetch(`http://localhost:${process.env.PORT}/api/recommend`,{
//       method:'POST',
//       headers:{
//         'Content-type':'application/json'
//       },
//       body:JSON.stringify({tags})
//     })
//     const responseData = await response.json()

//     responseData.recommendations.forEach(async (recommendation:Recommendation)=>{
//       await pool.query('insert into product values($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (product_id) DO NOTHING',[
//         recommendation.code,
//         recommendation.product_name,
//         recommendation.description,
//         recommendation.brands,
//         recommendation.clean_tags,
//         recommendation.image_url,
//         recommendation.eco_score
//       ])
//     })

//     res.send(responseData.recommendations)

//   }catch(err){
//     console.error(err)
//     res.status(500).send('error')
//   }
// }

export const addToFavorites = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "insert into favorites values($1,$2) on conflict (user_id,product_id) do nothing",
      [userId, productId]
    );
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const getFavorites = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  try {
    const result = await pool.query(
      ` SELECT p.product_id, p.name, p.description, p.brand, 
             p.clean_tags, p.image_url, p.ecoscore as eco_score, 
             0 as review_count
      FROM favorites f 
      JOIN product p ON f.product_id = p.product_id 
      WHERE f.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const deleteFromFavorites = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "delete from favorites where user_id=$1 and product_id=$2",
      [userId, productId]
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const addToReviewLater = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "insert into review_later values($1,$2) on conflict (user_id,product_id) do nothing",
      [userId, productId]
    );
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const getReviewLater = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  try {
    const result = await pool.query(
      `SELECT p.product_id, p.name, p.description, p.brand, 
             p.clean_tags, p.image_url, p.ecoscore as rating, 
             0 as review_count
      FROM review_later f 
      JOIN product p ON f.product_id = p.product_id 
      WHERE f.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const deleteFromReviewLater = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "delete from review_later where user_id=$1 and product_id=$2",
      [userId, productId]
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const addToNotInterested = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "insert into exclusion_list values($1,$2) on conflict (user_id,product_id) do nothing ",
      [userId, productId]
    );
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const getNotInterested = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  try {
    const result = await pool.query(
      `SELECT p.product_id, p.name, p.description, p.brand, 
             p.clean_tags, p.image_url, p.ecoscore as rating, 
             0 as review_count
      FROM exclusion_list f 
      JOIN product p ON f.product_id = p.product_id 
      WHERE f.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const deleteFromNotInterested = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.body;
  try {
    await pool.query(
      "delete from exclusion_list where user_id=$1 and product_id=$2",
      [userId, productId]
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};

export const checkCharacteristics = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.findUser?.userId;
  const { productId } = req.query;
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM favorites WHERE user_id = $1 AND product_id = $2) AS favorites,EXISTS (SELECT 1 FROM review_later WHERE user_id = $1 AND product_id = $2) AS review_later",
      [userId, productId]
    );
    const output = result.rows[0];
    res
      .status(200)
      .json({
        message: "success",
        favorites: output.favorites,
        reviewLater: output.review_later,
      });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
  return;
};
