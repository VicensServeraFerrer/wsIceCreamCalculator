import express from 'express';
import { SignJWT, jwtVerify } from "jose";
import bcrypt from 'bcrypt';
import db, { User } from '../database/db_schema.cjs';
import authByEmailPassword from '../helpers/authByemailpassword.js';

const authRouter = express.Router();

// Aportando los datos correspondientes (email y contraseña, headers authorithation) el usuario inicia session inicia sessión 
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            error: 'Campos incompletos',
            mensaje: 'Por favor, asegúrate de proporcionar email y contraseña.',
            camposFaltantes: [
              !email ? 'email' : null,
              !password ? 'password' : null,
            ].filter(Boolean), // Devuelve solo los campos faltantes
          });
    }

    try{
        const uuid = await authByEmailPassword(email, password);
        
        const jwtConstructor = new SignJWT({ uuid })

        const encoder = new TextEncoder();

        const jwt = await jwtConstructor
            .setProtectedHeader( {alg: "HS256", typ: "JWT"} )
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));

        return res.send({ jwt });
    } catch(err) {
        console.error(err);
        return res.sendStatus(401);
    }
    
});

export default authRouter;