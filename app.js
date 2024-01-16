import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config.js'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.js'

//import routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'

//db
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connect on:', mongoose.connection.host))
    .catch((err) => console.log(err))


const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}))
app.use(cookieParser())

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', orderRoutes)
app.use('/api', productRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Server on port', PORT)
})