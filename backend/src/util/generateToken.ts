import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId:string,email:string):string => {
  const payload = {
    userId,
    email
  }
  const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET!,{expiresIn:'10m'})

  return token
}

export const generateRefreshToken = (userId:string,email:string):string => {
  const payload = {
    userId,
    email
  }
  const token = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET!,{expiresIn:'10d'})
  return token
}
