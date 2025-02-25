import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';

const CreateFamilyDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: {
                type: "El nombre tiene que ser un string"
            }
        }),
        description: Type.String({
            errorMessage: {
                type: "La descripcion tiene que ser un string"
            }
        })
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
const validate = ajv.compile(CreateFamilyDTOSchema);

function validateCreateFamilyDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateCreateFamilyDTO;