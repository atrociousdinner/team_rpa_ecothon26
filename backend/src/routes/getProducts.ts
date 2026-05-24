import { Router } from 'express'
import { addToFavorites, addToNotInterested, addToReviewLater, checkCharacteristics, deleteFromFavorites,
         deleteFromNotInterested, deleteFromReviewLater, getSampleProducts,
        getFavorites, getReviewLater, getNotInterested } from '../controllers/getSampleProducts'
import { authorizeJWT } from '../middlewares/authorizeJWT'
import getTrendingProducts from '../controllers/getTrendingProducts'
import getRecentProducts from '../controllers/getRecentProducts'

const router = Router()

router.get('/get-sample-products',authorizeJWT,getSampleProducts)
router.post('/favorites',authorizeJWT,addToFavorites)
router.delete('/favorites',authorizeJWT,deleteFromFavorites)
router.post('/review-later',authorizeJWT,addToReviewLater)
router.delete('/review-later',authorizeJWT,deleteFromReviewLater)
router.post('/not-interested',authorizeJWT,addToNotInterested)
router.delete('/not-interested',authorizeJWT,deleteFromNotInterested)
router.get('/check-characteristics',authorizeJWT,checkCharacteristics)
router.get('/favorites',authorizeJWT, getFavorites)
router.get('/review-later',authorizeJWT, getReviewLater)
router.get('/not-interested',authorizeJWT, getNotInterested)

router.get('/get-trending-products', getTrendingProducts)
router.get('/get-recent-products', authorizeJWT, getRecentProducts)

export default router
