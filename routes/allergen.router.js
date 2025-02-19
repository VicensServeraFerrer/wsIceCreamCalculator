import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateAsociationInAllDTO from '../dto/validateAsociationInAllDTO.js';

const allergenRouter = express.Router();
const { IngredientAllergen } = db

// Obtiene todos los alergenos
allergenRouter.get("/getAll");

// Mediante el body de la request asocia un ingrediente con todos los alergenos especificados
allergenRouter.post("/asociate", authByToken, validateAsociationInAllDTO, async (req, res) => {
    const {ingredientId, allergenId} = req.body;

    const asociationExists = await IngredientAllergen.findOne({where: {"ingredientId": ingredientId, "allergenId": allergenId}});

    if(asociationExists) return res.status(400).send("La asociacion ya existe");

    try{
        const newAsociation = await IngredientAllergen.create(req.body);
        
        res.status(200).send(JSON.stringify(newAsociation));
    } catch(err){
        res.status(400).send(err);
    }

    
});

export default allergenRouter;
