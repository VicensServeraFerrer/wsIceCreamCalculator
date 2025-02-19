import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';

const AsociateInProDTOSchema = Type.Object(
    {
        ingredientId: Type.Number({
            errorMessage: {
                type: "El id del ingrediente tiene que ser un numero"
            }
        }),
        providerId: Type.Number({
            errorMessage: {
                type: "El id del proveedor tiene que ser un numero"
            }
        }),
        price: Type.Number({
            errorMessage: {
                type: "El precio tiene que ser un numero"
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
const validate = ajv.compile(AsociateInProDTOSchema);

function validateAsociationInProDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateAsociationInProDTO;