// let matrix = {
//     PAC: [],
//     POD: [],
//     MG: [],
//     ST: [],
//     LPD: [],
//     percentCocoa: []
// }
import glpk from "glpk.js"
import getPAC from "./getPAC.js";

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
            { name: "PAC", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
            { name: "POD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
            { name: "MG", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
            { name: "ST", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
            { name: "LPD", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
            { name: "percentCocoa", vars: [], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 0 } },
        ], 
        bounds: [
            
        ],
    }

    return {matrix, glpkInstance};
}

async function buildMatrix(ingredients, bounds){
    let {matrix, glpkInstance} = await initializeMatrix();

    console.log(matrix);
    matrix.subjectTo.forEach(subject => {
        if(subject.name == 'PAC') {
            const {PAClb, PACub} = getPAC(bounds.TS);

            subject.bnds.ub = PACub;
            subject.bnds.lb = PAClb;
        } else {
            subject.bnds.ub = bounds[subject.name] ? bounds[subject.name] : 0;
            subject.bnds.lb = bounds[subject.name] ? 0 : 0;
        }
        

        ingredients.forEach(ingredient => {
            const ingredientVariable = {name: ingredient.dataValues.name, coef: ingredient.dataValues[subject.name] ? ingredient.dataValues[subject.name]/100 : 0}

            subject.vars.push(ingredientVariable);
        })
    })

    matrix.subjectTo = matrix.subjectTo.filter(subject => noRelevantEquation(subject));
    
    matrix.subjectTo.forEach(subject => {
        subject.vars = subject.vars.filter(variable => {
            return variable.coef != 0;
        })
    })
    
    let equalEquation = { name: "sum1000", vars: [], bnds: {type: glpkInstance.GLP_FX, ub: 1000, lb: 1000}}
    ingredients.forEach(ingredient => {
        const ingredientVariable = {name: ingredient.dataValues.name, coef: 1}
        const ingredientBound = { name: ingredient.dataValues.name, type: glpkInstance.GLP_LO, lb: 0}
        
        matrix.objective.vars.push(ingredient.dataValues.name);
        matrix.bounds.push(ingredientBound);
        equalEquation.vars.push(ingredientVariable);
    });

    matrix.subjectTo.push(equalEquation);

    return {matrix, glpkInstance};
}

function noRelevantEquation(subject){
    let filteredSubject = subject.vars.filter(variable => {
        if(variable.coef != 0) return true;
    })

    return (Array.isArray(filteredSubject) && filteredSubject.length !== 0)
}

export default buildMatrix