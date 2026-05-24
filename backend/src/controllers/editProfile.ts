import bcrypt from 'bcrypt'
import { Response } from 'express'
import { CustomRequest } from '../@types/express'
import {
  updateUserName,
  updateUserGender,
  updateUserDob,
  getUserHashedPassword,
  updateUserPassword
} from '../db/users'

export const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { type } = req.params
  const userId = req.findUser?.userId
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: User ID missing' })
    return
  }
  const {
    displayName,
    gender,
    dob,
    currentPassword,
    newPassword
  } = req.body

  try {
    switch (type) {
      case 'name':
        if (!displayName) {
          res.status(400).json({ message: 'Display name required' })
          return
        }
        await updateUserName(userId, displayName)
        break

      case 'gender':
        if (!gender) {
          res.status(400).json({ message: 'Gender required' })
          return
        }
        await updateUserGender(userId, gender)
        break

      case 'dob':
        if (!dob) {
          res.status(400).json({ message: 'Date of birth required' })
          return
        }
        await updateUserDob(userId, dob)
        break

      case 'password':
        if (!currentPassword || !newPassword) {
          res.status(400).json({ message: 'Passwords required' })
          return
        }
        const hashedPassword = await getUserHashedPassword(userId)
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword)
        if (!isMatch) {
          res.status(400).json({ message: 'Incorrect current password' })
          return
        }
        if (newPassword.length < 6) {
          res.status(400).json({ message: 'Password must be at least 6 characters' })
          return
        }
        const newHashed = await bcrypt.hash(newPassword, 10)
        await updateUserPassword(userId, newHashed)
        break

      default:
        res.status(400).json({ message: 'Invalid update type' })
        return
    }

    res.json({ success: true })
    return
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      res.status(500).json({ message: 'Server error: ' + err.message })
      return
    }
    res.status(500).json({ message: 'Unknown server error' })
    return
  }
}
