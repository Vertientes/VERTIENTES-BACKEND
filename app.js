import express from 'express'
import 'dotenv/config.js'
import morgan from 'morgan'
import cors from 'cors'
import { errorHandler } from './middlewares/error.js'

//import routes
import authRoutes from './modules/user/authRoutes.js'
import userRoutes from './modules/user/userRoutes.js'
import orderRoutes from './modules/orders/orderRoutes.js'
import productRoutes from './modules/products/productRoutes.js'
import promotionRoutes from './modules/promotion/promotionRoutes.js'
import visitRoutes from './modules/visits/visitRoutes.js'
import requestRoutes from './modules/request/requestRoutes.js'
import deliveryRoutes from './modules/delivery/deliveryRoutes.js'
import companyRoutes from './modules/company/companyRoutes.js'
import { dbConnect } from './utils/dbConnect.js'


//db
dbConnect()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', orderRoutes)
app.use('/api', productRoutes)
app.use('/api', promotionRoutes)
app.use('/api', visitRoutes)
app.use('/api', requestRoutes)
app.use('/api', deliveryRoutes)
app.use('/api', companyRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Server on port', PORT)
})