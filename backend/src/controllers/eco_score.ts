import { Request, Response } from 'express';
import {
  getTagWeightJustification,
  positiveTagWeights,
  negativeTagWeights,
  tagDisplayMap,
  weightBandJustifications
} from '../util/tagWeights'

type tag = {
  name: string,
  value: any
}

export const ecoscoreController = (req: Request, res: Response) => {
  const { tags } = req.body;
  
  if (!Array.isArray(tags)) {
    res.status(400).json({ error: "Missing or invalid 'tags' in request body." });
    return;
  }

  const scoreProfile = calculateEcoScoreProfile(tags);
  res.json(scoreProfile);
}

const calculateEcoScoreProfile = (tags: tag[]) => {
  
  if(!tags.length) {
    return {
      ecoScore: 50,
      explanation: {
        baseline: 50,
        positiveScore: 0,
        negativeScore: 0,
        scoreFormula: "50 + (100 / PI) * atan(positiveScore - negativeScore)",
        summary: "No tags were provided, so the neutral baseline score is returned.",
        weightBands: weightBandJustifications,
        appliedTags: []
      }
    };
  }

  const readTags:string[] = []
  tags = tags.filter(tag => {
    const displayName = tagDisplayMap[tag.name] || tag.name;
    if (readTags.includes(displayName))
    {
      return false
    }
    else
    {
      readTags.push(displayName)
      return true  
    }
  })

  let posScore = tags.reduce((sum, tag) => sum + (positiveTagWeights[tag.name] || 0) * (tag.value || 100)/100, 0)
  let negScore = tags.reduce((sum, tag) => sum + (negativeTagWeights[tag.name] || 0) * (tag.value || 100)/100, 0)
 
  const score = 50 + (100/Math.PI) * Math.atan(posScore - negScore)
  const appliedTags = tags
    .map(tag => {
      const justification = getTagWeightJustification(tag.name);
      if (!justification) return null;

      const confidenceMultiplier = (tag.value || 100) / 100;

      return {
        tag: tag.name,
        label: justification.label,
        polarity: justification.polarity,
        weight: justification.weight,
        confidenceMultiplier,
        appliedWeight: Number((justification.weight * confidenceMultiplier).toFixed(3)),
        category: justification.category,
        confidence: justification.confidence,
        confidenceScore: justification.confidenceScore,
      };
    })
    .filter(Boolean);

  return {
    ecoScore: Math.floor(score),
    explanation: {
      baseline: 50,
      positiveScore: Number(posScore.toFixed(3)),
      negativeScore: Number(negScore.toFixed(3)),
      netSignal: Number((posScore - negScore).toFixed(3)),
      scoreFormula: "50 + (100 / PI) * atan(positiveScore - negativeScore)",
      summary: "Weights represent relative sustainability signals. Confidence scores classify how reliable each tag is as an eco-score signal.",
      weightBands: weightBandJustifications,
      appliedTags
    }
  };
};
