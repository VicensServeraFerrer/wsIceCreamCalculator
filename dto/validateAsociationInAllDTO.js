import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const AsociateInProDTOSchema = Type.Object(
    {
        ingredientId: Type.Number({
            errorMessage: {
                type: "El id del ingrediente tiene que ser un numero"
            }
        }),
        allergenId: Type.Number({
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
addFormat(ajv, ["email"]).addKeyword("kind").addKeyword("modifier");
addErrors(ajv);
const validate = ajv.compile(AsociateInProDTOSchema);

function validateAsociationInAllDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateAsociationInAllDTO;