import { RequestHandler } from 'express'
import type {Response} from 'express'
import { CustomRequest } from '../@types/express'
import { getUserByEmail } from '../db/users'

export const loginController:RequestHandler = (_req:CustomRequest,res:Response) => {

  res.status(200).json({login:true})
} 

export const authController:RequestHandler = async (req:CustomRequest,res:Response):Promise<void> => {
  if(req.findUser?.userId){
    const existingUser = await getUserByEmail(req.findUser?.email)
    const existingUserData = existingUser[0]
    res.status(200).json(
      {
        userId:req.findUser?.userId,
        email:req.findUser?.email,
        login:true,
        displayName:existingUserData.name,
        gender:existingUserData.gender,
        dob:existingUserData.dob,
        createdAt:existingUserData.created_at,
        photoURL:existingUserData.photo_url
      })
    return
  }
  res.status(401).json({login:false})
}
export const logoutController:RequestHandler = (_req:CustomRequest,res:Response) => {
  res.clearCookie('ACCESS_TOKEN')
  res.clearCookie('REFRESH_TOKEN')
  res.clearCookie('FIREBASE_TOKEN')
  res.sendStatus(200)
}
