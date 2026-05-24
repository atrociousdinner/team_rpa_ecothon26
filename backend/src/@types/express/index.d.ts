import { Request } from 'express'

export interface CustomRequest extends Request {
  findUser?: { //? denotes optional chaining. It indicates that this property might exist or may be undefined
    userId: string
    email: string
  }
}
