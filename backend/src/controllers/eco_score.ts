import { Request, Response } from 'express';
import { positiveTagWeights,negativeTagWeights } from '../util/tagWeights'
import { tagDisplayMap } from '../util/tagWeights';

type tag = {
  name: string,
  value: any
}

export const ecoscoreController = (req: Request, res: Response) => {
  const { tags } = req.body;
  
  if (typeof tags !== "object") {
     res.status(400).json({ error: "Missing or invalid 'tags' in request body." });
  }

  const ecoScore = calculateEcoScore(tags);
   res.json({ ecoScore });
}

const calculateEcoScore = (tags: tag[]): number => {
  
  if(!tags.length) return 50;

  const readTags:string[] = []
  tags = tags.filter(tag => {
    if (readTags.includes(tagDisplayMap[tag.name]))
    {
      return false
    }
    else
    {
      readTags.push(tagDisplayMap[tag.name])
      return true  
    }
  })

  let posScore = tags.reduce((sum, tag) => sum + (positiveTagWeights[tag.name] || 0) * (tag.value || 100)/100, 0)
  let negScore = tags.reduce((sum, tag) => sum + (negativeTagWeights[tag.name] || 0) * (tag.value || 100)/100, 0)
 
  const score = 50 + (100/Math.PI) * Math.atan(posScore - negScore)
  return Math.floor(score);
};

