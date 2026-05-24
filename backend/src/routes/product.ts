import { Router } from 'express'
import { authorizeJWT } from '../middlewares/authorizeJWT'
import { recordUserInteraction, getUserInteraction, recordViewDuration } from '../controllers/userInteractionController'
import { getAverageRating } from '../controllers/productsController'


const router = Router()

router.post('/product/:id', authorizeJWT, recordUserInteraction)
router.get('/product/:id', authorizeJWT, getUserInteraction)
router.post('/duration/:id', authorizeJWT, recordViewDuration)

router.get('/average-rating',getAverageRating)
export default router
