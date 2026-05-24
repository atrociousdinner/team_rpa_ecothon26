import pool from "../db/setupDB";
import { CustomRequest } from "../@types/express";
import { Response } from "express";
import cosineSimilarity from "../util/cosineSimilarity";

const getTrendingProducts = async (
  req: CustomRequest,
  res: Response
):Promise<any> => {
  try {
    const result = await pool.query(`
      SELECT user_id, input from input
    `)

    console.log(result.rows)

    const resultByUser = result.rows.reduce((arr: any, input: any) => {
      let existing = arr.find((a:any) => a.user_id === input.user_id)

      if(existing) {
        existing.combined_input += ' ' + input.input
      }
      else {
        arr.push({ user_id: input.user_id, combined_input: input.input })
      }

      return arr
    }, [])

    console.log(resultByUser)
    
    const combinedTags = resultByUser.reduce((array: any, input: any) => {
      let inputWithoutDuplication = input.combined_input.trim().split(' ').reduce((arr: any, i: any) => {
        let existing = arr.find((a: any) => a === i)

        if(!existing) {
          arr.push(i)
        }

        return arr
      }, [])

      console.log(inputWithoutDuplication)

      return [...array, ...inputWithoutDuplication]
    }, [])

    console.log(combinedTags)

    const tagsWithCount = combinedTags.reduce((arr: any, tag: string) => {
      let existing = arr.find((a: any) => a.tag === tag)

      if(existing) {
        existing.count++
      }
      else {
        arr.push({ tag: tag, count: 1 })
      }
      
      return arr
    }, [])

    console.log(tagsWithCount)

    const highestCount = Math.max(...tagsWithCount.map((t: any) => t.count))

    console.log(highestCount)

    const tags = tagsWithCount.filter((t: any) => t.count === highestCount).map((t: any) => t.tag).join(" ")
    
    console.log(tags)

    if(tags.trim())
    {
      console.log("...implementing cosine similarity to get trending products...")
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
    console.error("Error in fetching trending products: ", error);
  }
};

export default getTrendingProducts;
