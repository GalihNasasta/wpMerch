import express  from "express";
import { getAllUser, createUser, updateUser, deleteUser, changeProPic, authentication, register, updateCust } from "../controllers/userController";
import { verifyAddData, verifyEditUser, verifyAuthentication } from "../middleware/userValidation";
import uploadFile from "../middleware/userUpload";
import { verifyRole, verifyToken } from "../middleware/authorization";

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["ADMIN"])], getAllUser)
app.post('/', [verifyToken, verifyRole(["ADMIN"])], [verifyAddData], createUser)
app.put('/:id', [verifyToken, verifyRole(["ADMIN"])], [verifyEditUser], updateUser)
app.put('/editProfile/:id', [verifyToken, verifyRole(["CUSTOMER"])], [verifyEditUser], updateCust)
app.post('/login', [verifyAuthentication], authentication)
app.post('/register', [verifyAddData], register)
app.put('/pic/:id', [uploadFile.single("foto")], changeProPic)
app.delete('/:id', [verifyToken, verifyRole(["ADMIN"])], deleteUser)

// app.get('/', getAllUser)
// app.post('/', [verifyAddData], createUser)
// app.delete('/:id', deleteUser)
// app.post('/login', [verifyAuthentication], authentication)

export default app