import { Response,Request } from 'express'
import { fetchProducts, getFavoritesCount, getNotInterestedCount, getRatingsCount, getProductCount, getReviewLaterCount } from "../db/products";
import { CustomRequest } from '../@types/express'
import { getAverageViewedDuration } from '../db/userInteraction';
import { 
  getEcoScore, 
  getActivity, 
  getSustainability 
} from "../db/dashboard";
import pool from '../db/setupDB';

export const getProducts = async (req: CustomRequest, res: Response) => {
  try {
    const products = await fetchProducts(req.findUser?.userId ||'')
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json(err)
  }
}

export const getDashboardData = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.findUser?.userId;
  
  try {
    if (!userId) {
      res.status(401).json({
        status: false,
        message: 'User not found or not authenticated'
      });
      return;
    }

    // Fetch all dashboard data concurrently (removed engagementData)
    const [
      favoritesCount,
      productCount,
      reviewLaterCount,
      notInterestedCount,
      ratings,
      averageViewedDuration,
      ecoScoreData,
      activityData,
      sustainabilityData
    ] = await Promise.all([
      getFavoritesCount(userId),
      getProductCount(userId),
      getReviewLaterCount(userId),
      getNotInterestedCount(userId),
      getRatingsCount(userId),
      getAverageViewedDuration(userId),
      getEcoScore(userId),
      getActivity(userId),
      getSustainability(userId)
    ]);

    res.status(200).json({
      status: true,
      dashboardData: {
        // Collection counts
        favoritesCount: parseInt(favoritesCount),
        productCount: parseInt(productCount),
        reviewLaterCount: parseInt(reviewLaterCount),
        notInterestedCount: parseInt(notInterestedCount),
        
        // Ratings data
        ratings,
        
        // Average viewed duration and total views
        averageViewedDuration,
        
        // Chart data for dashboard (removed engagementPattern)
        ecoScoreProfile: ecoScoreData,
        activityTimeline: activityData,
        sustainabilityFocus: sustainabilityData
      }
    });
    
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({
      status: false,
      message: 'Internal server error while fetching dashboard data'
    });
  }
};

export const getUserEcoScore = async (req:CustomRequest,res:Response):Promise<void> => {
  const userId = req.findUser?.userId
  const data = await pool.query(" select ecoscore,duration,viewed from user_interaction join product on user_interaction.product_id = product.product_id where user_interaction.user_id = $1",[userId])
  
  const array = data.rows
  let sumView = 0
  let sumDuration = 0
  let productView = 0
  let productDuration = 0
  array.forEach((product)=>{
    productDuration += product.ecoscore*product.duration
    productView += product.ecoscore*product.viewed
    sumView+=product.viewed
    sumDuration +=product.duration
  })
  const userScore = (0.6*productView/(sumView*100) + 0.4*productDuration/(sumDuration*100)).toFixed(2)
  res.status(200).json({userScore})


}



export const getAverageRating = async (req:Request,res:Response):Promise<void> => {
  const {productId} = req.query
  const data = await pool.query('select sum(rating),count(rating) from user_interaction where product_id = $1',[productId])
  const {sum,count} = data.rows[0]
  if (count == 0){
    res.status(404).json({averageRating:0})
    return
  }
  const averageRating = (sum/count).toFixed(3)
  res.status(200).json({averageRating})
  return
}
