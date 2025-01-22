import { Type } from "@sinclair/typebox";

const milkDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        MG: Type.Number({
            errorMessage: "La materia grasa tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        LPD: Type.Number({
            errorMessage: "La leche en polvo desnatada tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        PAC: Type.Number({
            errorMessage: "El poder anticongelante tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const sugarDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        POD: Type.Number({
            errorMessage: "El poder edulcorante tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        PAC: Type.Number({
            errorMessage: "El poder anticongelante tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const fruitDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        percentsugar: Type.Number({
            errorMessage: "Porcentaje de azucar tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        orientativeQuantity: Type.Number({
            errorMessage: "Porcentaje de azucar tiene que ser un numero",
        }),
        MG: Type.Number({
            errorMessage: "Porcentaje de grasa tiene que ser un numero",
            minimum: 0,
            maximum: 100
        })
    },
    {
        additionalProperties: false,
        
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const cocoaDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        percentsugar: Type.Number({
            errorMessage: "Porcentaje de azucar tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        percentCocoa: Type.Number({
            errorMessage: "Porcentaje de cacao tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        percentCocoaButter: Type.Number({
            errorMessage: "Porcentaje de manteca de cacao tiene que ser un numero",
            minimum: 0,
            maximum: 100
        })
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const nutDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        percentsugar: Type.Number({
            errorMessage: "Porcentaje de azucar tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        MG: Type.Number({
            errorMessage: "Porcentaje de grasa tiene que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        orientativeQuantity: Type.Number({
            errorMessage: "Cantidad orientativa de producto tiene que ser un numero",
        })
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)

const spiceDTOSchema = Type.Object(
    {
        name: Type.String({
            errorMessage: "El nombre tiene que ser un String"
        }),
        description: Type.String({
            errorMessage: "La descripcion tiene que ser un String"
        }),
        ST: Type.Number({
            errorMessage: "Los solidos totales tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
        proportion: Type.Number({
            errorMessage: "La proporcion de especias tienen que ser un numero",
            minimum: 0,
            maximum: 100
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es vàlido"
        }
    }
)