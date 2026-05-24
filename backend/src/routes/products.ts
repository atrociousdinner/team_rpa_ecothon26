
import express from 'express';
import { authorizeJWT } from '../middlewares/authorizeJWT';
import { getProducts, getDashboardData, getUserEcoScore } from '../controllers/productsController';

const router = express.Router();


router.get('/get-products', authorizeJWT, getProducts);
router.get('/dashboard', authorizeJWT, getDashboardData)
router.get('/get-user-score',authorizeJWT,getUserEcoScore)
export default router;
