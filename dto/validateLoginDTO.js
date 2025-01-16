import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import addFormat from 'ajv-formats';
import addErrors from 'ajv-errors';

const LoginDTOSchema = Type.Object(
    {
        email: Type.String({
            format: "email",
            errorMessage: {
                type: "El tipo tiene que ser un string",
                format: "El email tiene que ser un correo electronico vàlido"
            }
        }),
        password: Type.String({
            errorMessage: "La contraseña tiene que ser un String"
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
addFormat(ajv, ["email"]).addKeyword("kind").addKeyword("modifier");
addErrors(ajv);
const validate = ajv.compile(LoginDTOSchema);

function validateLoginDTO (req, res, next) {
    const isValidDto = validate(req.body);

    if (!isValidDto) return res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}));

    next();
}


export default validateLoginDTO;