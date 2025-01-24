import { jwtVerify } from "jose";   

async function authByToken(req, res, next){
    const { authorization } = req.headers;

    if(!authorization) return res.status(401);

    try{
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY));

        req.jwtData = jwtData;

        next();
    } catch(err) {
        return res.status(401);
    }
}

export default authByToken;