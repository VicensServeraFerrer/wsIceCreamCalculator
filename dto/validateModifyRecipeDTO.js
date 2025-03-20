import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const modifyRecipeDTOSchema = Type.Object(
    {
        recipeId: Type.Number({
            errorMessage: {
                type: "El id del ingrediente tiene que ser un numero"
            }
        }),
        ingredients: Type.Array(
            Type.Object({
                id: Type.Number({
                errorMessage: "La id del ingrediente tiene que ser un numero"
            }),
                quantity: Type.Number({
                    errorMessage: "La cantidad del ingrediente tiene que ser un numero"
                })
            }),
            {
                errorMessage: "El array debe ser de tipos numericos"
            }
        ),
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
const validate = ajv.compile(modifyRecipeDTOSchema);

function validateModifyRecipeDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateModifyRecipeDTO;