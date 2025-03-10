import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const AsociateFamRecipeDTOSchema = Type.Object(
    {
        recipeId: Type.Number({
            errorMessage: {
                type: "El id del ingrediente tiene que ser un numero"
            }
        }),
        familyId: Type.Number({
            errorMessage: {
                type: "El id del proveedor tiene que ser un numero"
            }
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const ajv = new Ajv({allErrors: true});
addErrors(ajv);
const validate = ajv.compile(AsociateFamRecipeDTOSchema);

function validateAsociationFamRecipeDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateAsociationFamRecipeDTO;