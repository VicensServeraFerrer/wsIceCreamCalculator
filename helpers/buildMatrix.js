// let matrix = {
//     PAC: [],
//     POD: [],
//     MG: [],
//     ST: [],
//     LPD: [],
//     percentCocoa: []
// }
import glpk from "glpk.js"

const glpkInstance = await glpk();

let matrix = {
    name: "",
    objective: {
        direction: glpkInstance.GLP_MIN,
        name: "obj",
        vars: []
    },
    subjectTo: [
        { name: "PAC", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "POD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "MG", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "ST", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "LPD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "percentCocoa", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
        { name: "suma1000", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } }
    ], 
    bounds: [
        
    ],
}

const matrixKeys = Object.keys(matrix);

function buildMatrixA(ingredients){

    for(let i = 0; i < matrixKeys.length; i++){
        for(let j = 0; j < ingredients.length; j++){
            matrix[matrixKeys[i]][j] = ingredients[j].dataValues[matrixKeys[i]] ? ingredients[j].dataValues[matrixKeys[i]] : 0;
        }
    }

    return Object.values(matrix);
}

export default buildMatrixA