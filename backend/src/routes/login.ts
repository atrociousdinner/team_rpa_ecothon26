import { Router } from 'express'
import { loginController,authController,logoutController } from '../controllers/login'
import loginMiddleware from '../middlewares/loginMiddleware'
import { authorizeJWT } from '../middlewares/authorizeJWT'

const router = Router()

router.post('/login',loginMiddleware,loginController)

router.post('/auth',authorizeJWT,authController)

router.get('/logout',logoutController)
export default router
