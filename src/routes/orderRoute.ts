import express from "express"
import { getAllOrders, createOrder, deleteOrder, updateStatusOrder, upBuktiBayar, getHistory } from "../controllers/orderController";
import { verifyAddOrder, verifyEditStatus } from "../middleware/orderValidation";
import { verifyRole, verifyToken } from "../middleware/authorization";
import uploadFile from "../middleware/buktiUpload";

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["CUSTOMER", "ADMIN"])], getAllOrders)
app.get('/history', [verifyToken, verifyRole(["CUSTOMER", "ADMIN"])], getHistory)
app.post('/', [verifyToken, verifyRole(["CUSTOMER"]), verifyAddOrder], createOrder)
app.put('/:id', [verifyToken, verifyRole(["ADMIN"]), verifyEditStatus], updateStatusOrder)
app.delete('/:id', [verifyToken, verifyRole(["ADMIN"])], deleteOrder)
app.put('/pic/:id', [uploadFile.single("foto")], upBuktiBayar)

export default app