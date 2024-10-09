import express  from "express";
import { getAllProduk } from "../controllers/produkController";

const app = express()
app.use(express.json())

app.get('/', getAllProduk)

export default app