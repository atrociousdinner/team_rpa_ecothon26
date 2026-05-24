import { Request, Response, NextFunction, RequestHandler } from 'express'

export const validateSignup: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, dateOfBirth, gender } = req.body

  if (!name || !email || !password || !dateOfBirth || !gender) {
    res.status(400).json({ error: 'All fields are required' })
    return 
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' })
    return
  }

  next() 
}
