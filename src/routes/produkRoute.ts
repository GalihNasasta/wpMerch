import express  from "express";
import { getAllProduk, createProduk, updateProduk, deleteProduk, changePicture } from "../controllers/produkController";
import { verifyAddProduct, verifyEditMenu } from "../middleware/verifyProduct";
import uploadFile from "../middleware/produkUpload";

const app = express()
app.use(express.json())

app.get('/', getAllProduk)
app.post('/', [verifyAddProduct], createProduk)
app.put('/:id', [verifyEditMenu], updateProduk)
app.put('/pic/:id', [uploadFile.single("foto")], changePicture)
app.delete('/:id', deleteProduk)

export default app