import path from "path";
/** definisikan path (adress) odari root folder */
export const BASE_URL = `${path.join(__dirname, "../")}`
export const PORT = process.env.PORT
export const SECRET = process.env.SECRET;
