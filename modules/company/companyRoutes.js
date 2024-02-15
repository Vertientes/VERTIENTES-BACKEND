import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { isSuperAdmin } from '../../middlewares/isSuperAdmin.js'
import { getCompanies, newCompany, updateCompany } from './companyController.js'


const router = express.Router()

router.post('/new_company', verifyJwt, isSuperAdmin, newCompany)
router.get('/all_companies', verifyJwt, getCompanies)
router.put('/update_company/:id', validateNotEmptyFields(['holder_cuil', 'holder_name', 'neighborhood', 'street', 'house_number', 'city', 'postal_code', 'business_name', 'business_name_cuil', 'email', 'alias']), verifyJwt, isSuperAdmin, updateCompany)

export default router

