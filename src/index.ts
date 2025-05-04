import express from 'express'
import cors from 'cors'
import produkRoute from './routes/produkRoute'
import userRoute from './routes/userRoute'
import orderRoute from "./routes/orderRoute";

const PORT: number = 8080
const app = express()
app.use(cors())

app.use('/produk', produkRoute)
app.use('/user', userRoute)
app.use('/order', orderRoute)


app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    
})