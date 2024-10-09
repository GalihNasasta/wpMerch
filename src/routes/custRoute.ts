import express  from "express";
import { getAllCust, createCust, updateCustomer, deleteCustomer, changeProPic, authentication } from "../controllers/custController";
import { verifyAddData, verifyEditUser, verifyAuthentication } from "../middleware/userValidation";
import uploadFile from "../middleware/produkUpload";

const app = express()
app.use(express.json())

app.get('/', getAllCust)
app.post('/', [verifyAddData], createCust)
app.put('/:id', [verifyEditUser], updateCustomer)
app.post('/login', [verifyAuthentication], authentication)
app.put('/pic/:id', [uploadFile.single("foto")], changeProPic)
app.delete('/:id', deleteCustomer)

export default app