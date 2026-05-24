import type {Response,NextFunction} from 'express'
import { generateAccessToken, generateRefreshToken } from '../util/generateToken'
import { CustomRequest } from '../@types/express'
import pool from '../db/setupDB'
import bcrypt from 'bcrypt'


const loginMiddleware = async (req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
  const {email,password} = req.body
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  console.log(existingUser.rows.length == 0)
  if(existingUser.rows.length == 0){ // if(!existingUser) is always true, so the if condition is invalid. The query returns an object.
    res.status(401).json({message:'user not found',login:false})
    return
  }
  const temp = existingUser.rows[0]
  const userExists = bcrypt.compareSync(password,temp.hashed_password)
  
  if(!userExists){
    res.status(401).json({ message: 'password does not match', login: false })
    return
  }

  const findUser = {
    userId:temp.id.toString(),
    email:temp.email
  }
  const accessToken = generateAccessToken(findUser.userId,findUser.email)
  const refreshToken = generateRefreshToken(findUser.userId,findUser.email)

  res.cookie('ACCESS_TOKEN',accessToken,{httpOnly:true})
  res.cookie('REFRESH_TOKEN',refreshToken,{httpOnly:true})
  req.findUser = {userId:findUser.userId,email:findUser.email} 
  next()
}

export default loginMiddleware
