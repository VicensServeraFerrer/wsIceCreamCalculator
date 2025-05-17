import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateFamilyDTO from '../dto/validateCreateFamilyDTO.js';
import validateAsociationFamRecipeDTO from '../dto/validateAsociationFamRecipeDTO.js';

const familyRouter = express.Router();
const { Recipe, Family } = db

familyRouter.get("/getAll", authByToken, async (req, res) => {
    try {
        const families = await Family.findAll({where: {"userId": req.jwtData.payload.uuid}});

        return res.status(200).send(families);
    } catch (err) {
        res.status(400).send(err)
    }
})

familyRouter.post("/addRecipe", authByToken, validateAsociationFamRecipeDTO, async (req, res) => {
    const {recipeId, familyId} = req.body;

    try{
        const [affectedCount, affectedRows] = await Recipe.update({"familyId": familyId}, {where: {"id": recipeId}, returning: true})

        if(affectedCount == 0) return res.status(200).send("No se modificó ningun elemento")

        return res.status(200).send(affectedRows)
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
