import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateFamilyDTO from '../dto/validateCreateFamilyDTO.js';
import validateAsociationFamRecipeDTO from '../dto/validateAsociationFamRecipeDTO.js';

const familyRouter = express.Router();
const { Recipe, Family } = db

familyRouter.post("/addIngredient", authByToken, validateAsociationFamRecipeDTO, async (req, res) => {
    const {recipeId, familyId} = req.body;

    try{
        const recipeToModify = await Recipe.findOne({where: {"id": recipeId, "userId": req.jwtData.payload.uuid}});

        const [affectedCount, affectedRows] = await Recipe.update(recipeToModify, {where: {"familyId": familyId}, returning: true})

        if(affectedCount == 0) return res.status(200).send("No se modificó ningun elemento")
    } catch (err) {
        res.status(400).send(err)
    }


});

familyRouter.post("/create", authByToken, validateCreateFamilyDTO, async (req, res) => {
    const { name, description } = req.body;

    try{
        const newFamily = await Family.create({"userId": req.jwtData.payload.uuid, "name": name, "description": description});

        res.status(200).send(JSON.stringify(newFamily));
    } catch (err){
        res.status(400).send(err)
    }
});

export default familyRouter;
