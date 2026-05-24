import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { getUserByEmail, createNewUser, setUserPhotoUrl } from '../db/users'
import sendMail from '../util/sendMail'
import generateOTP from '../util/generateOTP'

export const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, dateOfBirth, gender } = req.body
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser.length > 0) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()

    // Insert new user into the DB
    await createNewUser(userId, name, email, hashedPassword, dateOfBirth, gender, '')

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const signupDetail = async (req: Request, res: Response) => {
  const { email, displayName, photoURL, password, dob, gender } = req.body

  const existingUser = await getUserByEmail(email)
  if (!existingUser[0]) {
    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)
    await createNewUser(userId, displayName, email, hashedPassword, dob, gender, photoURL)
    res.status(201).json({ status: true })
  } else {
    res.status(400).json({ status: false })
  }
}

export const checkAccount = async (req:Request,res:Response) => {
  const {email,photoURL} = req.body
  const existingUser = await getUserByEmail(email)
  if(existingUser[0].email === email){
    if(!existingUser[0].photo_url){
      await setUserPhotoUrl(email, photoURL)
    }
    res.status(200).json({status:true})
  }else{
    res.status(404).json({status:false})
  }

}
export const sendMailController = async (req:Request,res:Response) => {
  const {name,email} = req.body

  const otp = generateOTP()
  await sendMail(email,name,otp)

  res.status(200).json({otp})
  
}

export const checkEmail = async (req:Request, res:Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return
    }

    // Check if user already exists with this email
    const result = await getUserByEmail(email)

    if (result.length > 0) {
       res.status(200).json({ 
        exists: true, 
        message: 'Email is already registered' 
      });
      return
    }

     res.status(200).json({ 
      exists: false, 
      message: 'Email is available' 
    });
    return

  } catch (error) {
    console.error('Check email error:', error);
     res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
  return
};

