import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateRecipeByCalculatorDTO from '../dto/validateCreateRecipeByCalculatorDTO.js';
import buildMatrixA from '../helpers/buildMatrix.js';
import getPAC from '../helpers/getPAC.js';

const recipeRouter = express.Router();
const { Recipe, Ingredient } = db

recipeRouter.post("/calculate", authByToken, validateCreateRecipeByCalculatorDTO, async (req, res) => {
    const { ingredients } = req.body;

    
    try {
        const ingredientIds = ingredients.map(ing => ing.id);

        const fullIngredients = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid}});

        let matrixA = buildMatrixA(fullIngredients);
        let matrixB = [getPAC(req.body.TS), req.body.POD, req.body.MG, req.body.ST, req.body.LPD, req.body.percentCocoa];

        console.log(matrixA);
        console.log(matrixB);

    } catch(err){
        res.status(400).send(err)
    }
})

export default recipeRouter;
