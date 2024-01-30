import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { getVisitsForOrder, newVisit } from '../controllers/visitController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'

const router = express.Router()

router.post('/new_visit', validateNotEmptyFields(['visit_date', 'quantity_delivered', 'observation']), verifyJwt, isAdmin, newVisit)
router.get('/all_visits_order/:id', verifyJwt, isAdmin, getVisitsForOrder)

export default router

