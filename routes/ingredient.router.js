import express from 'express';
import db from '../database/db_schema.cjs';
import validateCreateIngredientDTO from '../dto/validateCreateIngredientDTO.js';
import authByToken from '../helpers/authByToken.js';
import partialToCompleteIngredientMapper from '../mappers/partialToCompleteIngredient.mapper.js';
import { where } from 'sequelize';

const ingredientRouter = express.Router();
const { Ingredient, Type } = db;

ingredientRouter.get("/get/:name", authByToken, async (req, res) => {
    const { name } = req.params;

    const ingredient = await Ingredient.findOne({where: {"userId": req.jwtData.payload.uuid, "name": name}})

    if(!ingredient) return res.status(200).send(JSON.stringify({message: "No existe el ingrediente"}));

    return res.status(200).send(JSON.stringify(ingredient))
})

ingredientRouter.get("/getAll", authByToken, async (req, res) => {
    const ingredients = await Ingredient.findAll({where: { "userId": req.jwtData.payload.uuid }})

    if(!ingredients) return res.status(200).send(JSON.stringify({message: "No hay ingredientes de este tipo"}));

    const groupedIngredients = {}
    
    await Promise.all(
        ingredients.map(async (ingredient) => {
            const ingredientType = await Type.findOne({where: {"id": ingredient.ingredientType}}) 
            const ingredientTypeName = ingredientType.name

            if (!groupedIngredients[ingredientTypeName]) {
                groupedIngredients[ingredientTypeName] = [];
            }
    
            groupedIngredients[ingredientTypeName].push(ingredient);
            })
        );

    return res.status(200).send(JSON.stringify({groupedIngredients}))
});

ingredientRouter.get("/getAll/:ingredientType", authByToken, async (req, res) => {
    const { ingredientType } = req.params;

    const ingredients = await Ingredient.findAll({where: { "userId": req.jwtData.payload.uuid, "ingredientType": Number(ingredientType) }})

    if(!ingredients) return res.status(200).send(JSON.stringify({message: "No hay ingredientes de este tipo"}));

    return res.status(200).send(JSON.stringify({"ingredients": ingredients}))
});

ingredientRouter.post("/create", authByToken, validateCreateIngredientDTO, partialToCompleteIngredientMapper, async (req, res) => {
    const ingredient = req.completeIngredient;

    const newIngredient = await Ingredient.create(ingredient);

    if (!newIngredient) return res.status(400).send(JSON.stringify({message: "El ingrediente no ha sido introducido"}));

    return res.status(200).send(JSON.stringify({
        message: "El ingrediente ha sido introducido"
    }));
});

ingredientRouter.post("/modify/:id", authByToken, partialToCompleteIngredientMapper, async (req, res) => {
    const ingredientId = req.params.id;

    if(!ingredientId) return res.status(404).send("No hay id de ingrediente en los parametros")

    const ingredient = req.completeIngredient;

    const [affectedCount, affectedRows] = await Ingredient.update(ingredient, {where: {"ingredientId": ingredientId}, returning: true})

    if(affectedCount == 0) return res.status(200).send("No se modificó ningun elemento")

    return res.status(200).send(affectedRows)
});

export default ingredientRouter;