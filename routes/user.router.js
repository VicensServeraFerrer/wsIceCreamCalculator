import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db_schema.cjs';

const userRouter = express.Router();
const { User } = db


// Aportando los datos correspondientes (email y contraseña) el usuario inicia session
userRouter.post("/login", (req, res) => {

});

// Aportando los datos correspondientes (nombre, email, contraseña y numero de telefono) crea una cuenta para este usuario
userRouter.post("/create", async (req, res) => {
    const {name, email, password, tlf} = req.body;

    if(!name || !email || !password || !tlf){
        return res.status(400).json({
            error: 'Campos incompletos',
            mensaje: 'Por favor, asegúrate de proporcionar nombre, email, contraseña y teléfono.',
            camposFaltantes: [
              !name ? 'nombre' : null,
              !email ? 'email' : null,
              !password ? 'password' : null,
              !tlf ? 'tlf' : null,
            ].filter(Boolean), // Devuelve solo los campos faltantes
          });
    }

    //Control de existència de usuario
    const userExists = await User.findOne({where: {"email": email}});
    console.log(userExists);
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
