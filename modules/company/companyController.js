import { ErrorResponse } from "../../utils/errorResponse.js";
import Company from './companyModel.js'

export const newCompany = async (req, res, next) => {
    try {
        const { holder_cuil, holder_name, neighborhood, street, house_number, city, postal_code, business_name, business_name_cuil, email, alias } = req.body
        const company = await Company.find()
        if (company.length > 0) {
            throw new ErrorResponse('Solo puede haber una empresa', 400)
        }

        const newCompany = new Company({
            holder_cuil,
            holder_name,
            company_address: {
                neighborhood,
                street,
                house_number,
            },
            city,
            postal_code,
            business_name,
            business_name_cuil,
            email,
            alias
        })

        const savedCompany = await newCompany.save()

        res.status(201).json({
            success: true,
            savedCompany
        })
    } catch (error) {
        next(error)
    }
}

export const getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find()
        res.status(200).json({
            success: true,
            companies
        })
    } catch (error) {
        next(error)
    }
}

export const updateCompany = async (req, res, next) => {
    try {
        const { id } = req.params
        const { holder_cuil, holder_name, neighborhood, street, house_number, city, postal_code, business_name, business_name_cuil, email, alias } = req.body

        const updatedCompany = await Company.findByIdAndUpdate(id, { holder_cuil, holder_name, neighborhood, street, house_number, city, postal_code, business_name, business_name_cuil, email, alias }, { new: true })

        res.status(200).json({
            success: true,
            updatedCompany
        })
    } catch (error) {
        next(error)
    }
}