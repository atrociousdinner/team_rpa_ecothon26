import {Response } from "express";
import { CustomRequest } from "../@types/express";
import { getUserByEmail } from "../db/users";
import { fetchProduct } from "../db/products";
import { setUserRating, setUserViewed, getRating } from "../db/userInteraction";

export const recordUserInteraction = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.findUser?.userId
    const userEmail = req.findUser?.email
    const { rating } = req.body

    try {
        if (!userId || !userEmail) {
            res.status(401).json({
                status: false,
                message: 'User not found or not authenticated'
            })
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({
                status: false,
                message: 'Invalid rating. Rating must be between 1 and 5'
            })
            return;
        }
    
        const product_id = req.params.id
        const product = await fetchProduct(product_id)
        const user = await getUserByEmail(userEmail)

        await setUserRating(userId, product_id, rating) 

        res.status(201).json({
            status: true,
            message: 'Rating submitted successfully',
            user_data: user,
            product_data: product,
            action: "rating",
            rating
        })
        
    }
    catch (err) {
        console.error('Error submitting rating', err)
        res.status(500).json({
            status: false,
            message: 'Internal server error while submitting rating'
        })
    }
}

export const recordViewDuration = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.findUser?.userId
    const {duration}  = req.body
    console.log(duration)

    try {
        if (!userId) {
            res.status(401).json({
                status: false,
                message: 'User not found or not authenticated'
            })
            return;
        }

        if (!duration || duration <= 0) {
            res.status(400).json({
                status: false,
                message: 'Invalid duration'
            })
            return;
        }
    
        const product_id = req.params.id
        
        await setUserViewed(userId, product_id, Math.floor(duration))

        res.status(201).json({
            status: true,
            message: 'View duration recorded successfully',
            action: "viewed",
            duration
        })
        
    }
    catch (err) {
        console.error('Error recording view duration', err)
        res.status(500).json({
            status: false,
            message: 'Internal server error while recording view duration'
        })
    }
}

export const getUserInteraction = async (req: CustomRequest, res: Response): Promise<void> => {
        const userId = req.findUser?.userId
        const product_id = req.params.id
        if(!userId)
        {
            return;
        }
        const rating = await getRating(userId, product_id)
        res.status(200).json({
            success: true,
            rating: rating
        })


}
