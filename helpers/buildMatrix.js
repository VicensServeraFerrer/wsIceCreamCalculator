// let matrix = {
//     PAC: [],
//     POD: [],
//     MG: [],
//     ST: [],
//     LPD: [],
//     percentCocoa: []
// }
import glpk from "glpk.js"
import { Ingredient } from "../database/db_schema.cjs";

async function initializeMatrix(){
    const glpkInstance = await glpk();

    let matrix = {
        name: "",
        objective: {
            direction: glpkInstance.GLP_MIN,
            name: "obj",
            vars: []
        },
        subjectTo: [
            { name: "PAC", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
            { name: "POD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
            { name: "MG", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
            { name: "ST", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
            { name: "LPD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
            { name: "percentCocoa", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 0, lb: 0 } },
        ], 
        bounds: [
            
        ],
    }

    return {matrix, glpkInstance};
}


const matrixKeys = Object.keys(matrix);

function buildMatrixA(ingredients, bounds){
    let {matrix, glpkInstance} = initializeMatrix();

    ingredients.forEach(ingredient => {
        matrix.objective.vars.push(ingredient.dataValues.name);
    });

    matrix.subjectTo.forEach(subject => {
        ingredients.forEach(ingredient => {
            const ingredientVariable = {name: ingredient.dataValues.name, coef: ingredient.dataValues[subject.name] ? ingredient.dataValues[subject.name] : 0}

            subject.vars.push(ingredientVariable);
        })
    })

    

    for(let i = 0; i < matrixKeys.length; i++){
        for(let j = 0; j < ingredients.length; j++){
            matrix[matrixKeys[i]][j] = ingredients[j].dataValues[matrixKeys[i]] ? ingredients[j].dataValues[matrixKeys[i]] : 0;
        }
    }

    return Object.values(matrix);
}

export default buildMatrixA