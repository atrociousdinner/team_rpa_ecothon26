import { Router } from 'express'
import { validateSignup } from '../middlewares/signupMiddleware'
import { checkAccount, sendMailController, signupDetail, signupUser, checkEmail } from '../controllers/signup'

const router = Router()

router.post('/signup', validateSignup, signupUser)
router.post('/signup-detail',signupDetail)
router.post('/check-account',checkAccount)
router.post('/send-mail',sendMailController)
router.post('/check-email',checkEmail)

export default router
