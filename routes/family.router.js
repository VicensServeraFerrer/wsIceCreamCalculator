import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateFamilyDTO from '../dto/validateCreateFamilyDTO.js';

const familyRouter = express.Router();
const { Recipe, Family } = db

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
