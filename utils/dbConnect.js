import mongoose from "mongoose"
export const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI/* , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        } */)
        console.log('Db connect on ', mongoose.connection.host)
    } catch (error) {
        console.log('Database error')
    }

}