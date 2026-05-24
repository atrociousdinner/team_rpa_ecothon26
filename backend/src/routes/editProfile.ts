import { Router } from 'express'
import { authorizeJWT } from '../middlewares/authorizeJWT'
import { updateProfile } from '../controllers/editProfile'

const router = Router()

router.put('/update/:type', authorizeJWT, updateProfile)

export default router
