import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const InsertRecipeDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: {
                type: "El nombre tiene que ser un string"
            }
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        familyId: Type.Union(
            [
                Type.Number(),
                Type.Null()
            ],
            {
            errorMessage: "La id de la familia tiene que ser un numero o null"
        }),
        TS: Type.Number({
            errorMessage: "La id de la familia tiene que ser un numero"
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
        )
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
const validate = ajv.compile(InsertRecipeDTOSchema);

function validateInsertRecipeDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateInsertRecipeDTO;