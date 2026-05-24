import { Router } from "express";
import searchProductMiddleware from "../middlewares/searchProductMiddleware";
import searchProductController from "../controllers/searchProductController";
import { authorizeJWT } from "../middlewares/authorizeJWT";

const router = Router();

router.post("/search-product", authorizeJWT, searchProductMiddleware, searchProductController);

export default router;
