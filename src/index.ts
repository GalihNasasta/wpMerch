import express from 'express'
import cors from 'cors'
import produkRoute from './routes/produkRoute'

const PORT: number = 8000
const app = express()
app.use(cors())

app.use('/produk', produkRoute)


app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    
})