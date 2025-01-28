import bcrypt from 'bcrypt';
import db from '../database/db_schema.cjs';


async function authByEmailPassword(email, password){
    const { User } = db;

    const user = await User.findOne({where: {"email": email}});

    if(!user) throw new Error("El usuario es incorrect");

    const match = await bcrypt.compare(password, user["password"])
    
    if (match) return user["uuid"];
    
    throw new Error("La contraseña es incorrecta");
}

export default authByEmailPassword;