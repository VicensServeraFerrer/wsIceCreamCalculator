import express from 'express';
import { SignJWT } from "jose";
import authByEmailPassword from '../helpers/authByemailpassword.js';
import validateLoginDTO from '../dto/validateLoginDTO.js';

const authRouter = express.Router();

// Aportando los datos correspondientes (email y contraseña, headers authorithation) el usuario inicia session inicia sessión 
authRouter.post("/login", validateLoginDTO,  async (req, res) => {
    const { email, password } = req.body;

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