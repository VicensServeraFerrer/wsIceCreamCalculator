import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import ingredientTypesDTOS from "./ingredientTypesDTOS.js";

const ajv = new Ajv({allErrors: true});
addErrors(ajv);

function validateCreateIngredientDTO(req, res, next) {

    const { ingredientType } = req.body;

    if(ingredientType === undefined) return res.status(400).send("No hay un campo tipo de ingrediente")

    let validate;
    switch(ingredientType){
        //Milk
        case 1:
            validate = ajv.compile(ingredientTypesDTOS.milkDTOSchema);
        break;
        //Sugar
        case 2:
            validate = ajv.compile(ingredientTypesDTOS.sugarDTOSchema);
        break;
        //Fruit
        case 3:
            validate = ajv.compile(ingredientTypesDTOS.fruitDTOSchema);
        break;
        //Cocoa
        case 4:
            validate = ajv.compile(ingredientTypesDTOS.cocoaDTOSchema);
        break;
        //Nut
        case 5:
            validate = ajv.compile(ingredientTypesDTOS.nutDTOSchema);
        break;
        //Spice
        case 6:
            validate = ajv.compile(ingredientTypesDTOS.spiceDTOSchema);
        break;
        //Cheese
        case 7:
            validate = ajv.compile(ingredientTypesDTOS.cheeseDTOSchema);
        break;
        //Salty
        case 8:
            validate = ajv.compile(ingredientTypesDTOS.saltyDTOSchema);
        break;
        //Alcohol
        case 9:
            validate = ajv.compile(ingredientTypesDTOS.alcoholDTOSchema);
        break;
        //Generic
        default:
            validate = ajv.compile(ingredientTypesDTOS.genericDTOSchema);
        break;
    }

    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}

export default validateCreateIngredientDTO;
