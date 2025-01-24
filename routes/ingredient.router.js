import express from 'express';
import db from '../database/db_schema.cjs';
import validateCreateIngredientDTO from '../dto/validateCreateIngredientDTO.js';
import authByToken from '../helpers/authByToken.js';

const ingredientRouter = express.Router();

ingredientRouter.post("/create",authByToken, validateCreateIngredientDTO, (req, res) => {
    
});