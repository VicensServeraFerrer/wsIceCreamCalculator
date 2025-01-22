import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import ingredientTypesDTOS from "./ingredientTypesDTOS";

const ajv = new Ajv({allErrors: true});
addKeyword("kind").addKeyword("modifier");
addErrors(ajv);

function validateCreateIngredientDTO(req, res, next) {
    const { ingredientType } = req.body;

    if(!ingredientType) return res.status(400).send("No hay un campo tipo de ingrediente")

    switch(ingredientType){
        case 1:
        break;
        case 2:
        break;
        case 3:
        break;
        case 4:
        break;
        case 5:
        break;
        case 6:
        break;
        case 7:
        break;
        case 8:
        break;
        case 9:
        break;
        case 10:
        break;
    }
}