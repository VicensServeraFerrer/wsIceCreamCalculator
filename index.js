import express from 'express';
import dotenv from "dotenv";
import userRouter from './routes/user.router.js';

dotenv.config();
console.log(process.env)

const PORT =  3000;
const expressApp = express()

expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use("/user", userRouter);

expressApp.listen(PORT, () => {
    console.log(`Servidor levantado en ${PORT}`);
})