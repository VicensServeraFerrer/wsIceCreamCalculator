import express from 'express';
import { SignJWT, jwtVerify } from "jose";

const authRouter = express.Router();

// Aportando los datos correspondientes (email y contraseña, headers authorithation) el usuario inicia session inicia sessión 
userRouter.post("/login", (req, res) => {
    
});

export default authRouter;