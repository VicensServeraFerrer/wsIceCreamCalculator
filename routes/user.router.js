import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db_schema.cjs';
import validateCreateUserDTO from '../dto/validateCreateUserDTO.js';

const userRouter = express.Router();
const { User } = db

// Aportando los datos correspondientes (nombre, email, contraseña y numero de telefono) crea una cuenta para este usuario
userRouter.post("/create", validateCreateUserDTO, async (req, res) => {
    const {name, email, password, tlf} = req.body;

    //Control de existència de usuario
    const userExists = await User.findOne({where: {"email": email}});
    
    if(userExists){
      return res.status(400).send("El usuario ya se encuentra registrado");
    }

    //Codificar contraseña del cliente
    const hashed_password = await bcrypt.hash(password, 10);

    //Creación del nuevo usuario
    const newUser = await User.create({userName: name, email: email, password: hashed_password, phoneNum: tlf, userType: 2})

    return res.status(200).send(JSON.stringify({
        uuid: newUser.uuid,
    }))
});

export default userRouter;
