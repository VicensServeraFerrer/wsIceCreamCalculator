import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const CreateUserDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: {
                type: "El nombre tiene que ser un string"
            }
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        familyId: Type.Number({
            errorMessage: "La id de la familia tiene que ser un numero"
        }),
        MG: Type.Union(
            [
                Type.Number(),
                Type.Null()
            ],
            {
            errorMessage: "La materia grasa tiene que ser un numero o null"
        }),
        ST: Type.Union(
            [
                Type.Number(),
                Type.Null()
            ],
            {
            errorMessage: "Los solidos totales tienen que ser un numero o null"
        }),
        LPD: Type.Union(
            [
                Type.Number(),
                Type.Null()
            ],
            {
            errorMessage: "La leche en polvo desnatada tiene que ser un numero o null"
        }),
        TS: Type.Number({
            errorMessage: "La temperatura de servicio tiene que ser un numero o null"
        }),
        percentCacao: Type.Union(
            [
                Type.Number(),
                Type.Null()
            ],
            {
            errorMessage: "El porcentaje de cacao tiene que ser un numero o null"
        }),
        ingredients: Type.Array(
            Type.Object({
                id: Type.Number({
                errorMessage: "La id del ingrediente tiene que ser un numero"
            }),
                quantity: Type.Union(
                    [
                        Type.Number(),
                        Type.Null()
                    ],
                    {
                    errorMessage: "La cantidad del ingrediente tiene que ser un numero o null"
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
const validate = ajv.compile(CreateUserDTOSchema);

function validateCreateRecipeByCalculatorDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateCreateRecipeByCalculatorDTO;