import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { createPromotion, getPromotions } from '../controllers/promotionController.js'
import { isAdmin } from '../middlewares/isAdmin.js'

const router = express.Router()

router.post('/new_promotion', verifyJwt, isAdmin, createPromotion)
router.get('/all_promotions', verifyJwt, isAdmin, getPromotions)

export default router

