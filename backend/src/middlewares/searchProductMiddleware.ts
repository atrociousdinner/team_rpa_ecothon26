import { Response, NextFunction } from "express";
import { CustomRequest } from "../@types/express";

const searchProductMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userId = req.findUser?.userId;
  const { type, data } = req.body.input;

  if (!userId) {
    res
      .status(400)
      .json({ message: "User Id is required for searching product" });
    return;
  }

  if (!type || !data) {
    res.status(400).json({ message: "Data is required for searching product" });
    return;
  }

  next();
};

export default searchProductMiddleware;
