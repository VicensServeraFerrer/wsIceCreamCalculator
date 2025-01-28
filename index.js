import express from 'express';
import dotenv from "dotenv";
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import ingredientRouter from './routes/ingredient.router.js';

dotenv.config();
console.log(process.env)

const PORT =  3000;
const expressApp = express()

expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use("/user", userRouter);
expressApp.use("/auth", authRouter);
expressApp.use("/ingredient", ingredientRouter)

expressApp.listen(PORT, () => {
    console.log(`Servidor levantado en ${PORT}`);
})