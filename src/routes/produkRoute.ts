import express  from "express";
import { getAllProduk, createProduk, updateProduk, deleteProduk, changePicture } from "../controllers/produkController";
import { verifyAddProduct, verifyEditMenu } from "../middleware/verifyProduct";
import { verifyRole, verifyToken } from "../middleware/authorization";
import uploadFile from "../middleware/produkUpload";

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["ADMIN", "CUSTOMER"])], getAllProduk)
app.post('/', [verifyToken, verifyRole(["ADMIN"])], [verifyAddProduct], createProduk)
app.put('/:id', [verifyToken, verifyRole(["ADMIN"])], [verifyEditMenu], updateProduk)
app.put('/pic/:id', [verifyToken, verifyRole(["ADMIN"])], [uploadFile.single("foto")], changePicture)
app.delete('/:id', [verifyToken, verifyRole(["ADMIN"])], deleteProduk)

export default app