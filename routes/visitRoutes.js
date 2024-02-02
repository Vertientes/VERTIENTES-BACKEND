import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { createVisit, getVisitsForOrder } from '../controllers/visitController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'

const router = express.Router()

router.put('/new_visit/:id', validateNotEmptyFields(['number_of_visit', 'quantity_delivered', 'returned_drums', 'observation']), verifyJwt, isAdmin, createVisit)
router.get('/all_visits_order/:id', verifyJwt, isAdmin, getVisitsForOrder)

export default router

