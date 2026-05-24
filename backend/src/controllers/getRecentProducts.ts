import pool from "../db/setupDB";
import { CustomRequest } from "../@types/express";
import { Response } from "express";
import cosineSimilarity from "../util/cosineSimilarity";

const getRecentProducts = async (
  req: CustomRequest,
  res: Response
):Promise<any> => {
  try {
    const userId = req.findUser?.userId;
    
    const recentInput = await pool.query(`
      SELECT input FROM input
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 3
    `, [userId]);

    const inputTags = recentInput.rows.map((i:any) => i.input).join(" ")

    console.log("\nInput tags: ", inputTags)

    const recentInteraction = await pool.query(`
      SELECT p.clean_tags
      FROM (
        SELECT product_id
        FROM user_interaction
        where user_id = $1
        ORDER BY created_at DESC
        LIMIT 3
      ) AS top_products
      JOIN product p ON p.product_id = top_products.product_id;
    `, [userId])

    const recentInteractionTags = recentInteraction.rows.map((i:any) => i.clean_tags).join(" ")

    console.log("\nRecent Interaction Tags: ", recentInteractionTags)

    const topInteraction = await pool.query(`
      SELECT p.clean_tags
      FROM (
        SELECT product_id
        FROM user_interaction
        where user_id = $1
        ORDER BY duration DESC
        LIMIT 3
      ) AS top_products
      JOIN product p ON p.product_id = top_products.product_id;
    `, [userId])

    const topInteractionTags = topInteraction.rows.map((i:any) => i.clean_tags).join(" ")

    console.log("\nTop Interaction Tags: ", topInteractionTags)

    const combinedTags = [inputTags, recentInteractionTags, topInteractionTags].join(" ")

    console.log("\nCombined Tags: ", combinedTags)

    const tags = combinedTags.trim().split(" ").reduce((arr: any, tag: any) => {
      const existing = arr.find((a: any) => a===tag)

      if(!existing)
      {
        arr.push(tag)
      }

      return arr
    }, []).join(" ")

    console.log("\nTags: ", tags)

    if(tags.trim())
    {
      console.log("...implementing cosine similarity to get recent products...")
      const recommendations = await cosineSimilarity(tags.trim()) 

      return res.status(200).json({
        message: "Products fetched successfully",
        recommendations: recommendations.sort((a: any, b: any) => {
          return b.eco_score - a.eco_score
        }),
      });
    }

    return res.status(200).json({
      message: "Tags are empty",
      recommendations: [],
    });
  } 
  catch (error) {
    console.error("Error in fetching recent products: ", error);
  }
};

export default getRecentProducts;
