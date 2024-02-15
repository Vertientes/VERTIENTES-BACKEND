import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'
import { isSuperAdmin } from '../../middlewares/isSuperAdmin.js'
import { getCompanies, newCompany } from './companyController.js'


const router = express.Router()

router.post('/new_company', verifyJwt, isSuperAdmin, newCompany)
router.get('/all_companies', verifyJwt, isSuperAdmin, getCompanies)

export default router

