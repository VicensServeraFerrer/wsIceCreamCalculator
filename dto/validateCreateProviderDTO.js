import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const CreateProviderDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: {
                type: "El nombre tiene que ser un string"
            }
        }),
        tlf: Type.String({
            errorMessage: {
                type: "El telefono tiene que ser un string"
            }
        }),
        address: Type.String({
            errorMessage: "La dirección tiene que ser un String"
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
const validate = ajv.compile(CreateProviderDTOSchema);

function validateCreateUserDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateCreateUserDTO;