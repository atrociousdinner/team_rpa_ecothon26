
import express from 'express';
import { setUserPreferences, checkUserPreferences, getUserPreferences } from '../controllers/userPreference';
import { authorizeJWT } from '../middlewares/authorizeJWT';

const router = express.Router();

// Set user preferences
router.post('/set-preferences', authorizeJWT, setUserPreferences);

router.get('/check-user-preferences',authorizeJWT, checkUserPreferences)

router.get('/get-preferences', authorizeJWT, getUserPreferences);

export default router;