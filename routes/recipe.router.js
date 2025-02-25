import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';

const recipeRouter = express.Router();
const { Recipe,  } = db

recipeRouter.post("/calculate", authByToken, async (req, res) => {

})

export default recipeRouter;
