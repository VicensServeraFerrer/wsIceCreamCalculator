const matrix = {
    PAC: [],
    POD: [],
    MG: [],
    ST: [],
    LPD: [],
    percentCocoa: []
}

import getPAC from "./getPAC.js";

async function buildMatrix(ingredients, bounds){
    const matrixA = matrix;
    const matrixB = matrix;

    const keyNames = Object.keys(matrix);

    keyNames.forEach(key => {
        if(key == 'PAC'){
            const PAC = getPAC(bounds.TS);
            matrixB[key].push(PAC.PACub);
        } else {
            matrixB[key].push(bounds[key]);
        }

        ingredients.forEach(ingredient => {
            matrixA[key].push(ingredient.dataValues[key] ? ingredient.dataValues[key]/100 : 0);
        })
    })
 
    return { matrixA, matrixB }; 
    // let {matrix, glpkInstance} = await initializeMatrix();

    // console.log(matrix);
    // matrix.subjectTo.forEach(subject => {
    //     if(subject.name == 'PAC') {
    //         const {PAClb, PACub} = getPAC(bounds.TS);

    //         subject.bnds.ub = PACub;
    //         subject.bnds.lb = PAClb;
    //     } else {
    //         subject.bnds.ub = bounds[subject.name] ? bounds[subject.name] : 0;
    //         subject.bnds.lb = bounds[subject.name] ? 0 : 0;
    //     }
        

    //     ingredients.forEach(ingredient => {
    //         const ingredientVariable = {name: ingredient.dataValues.name, coef: ingredient.dataValues[subject.name] ? ingredient.dataValues[subject.name]/100 : 0}

    //         subject.vars.push(ingredientVariable);
    //     })
    // })

    // matrix.subjectTo = matrix.subjectTo.filter(subject => noRelevantEquation(subject));
    
    // matrix.subjectTo.forEach(subject => {
    //     subject.vars = subject.vars.filter(variable => {
    //         return variable.coef != 0;
    //     })
    // })
    
    // let equalEquation = { name: "sum1000", vars: [], bnds: {type: glpkInstance.GLP_FX, ub: 1000, lb: 1000}}
    // ingredients.forEach(ingredient => {
    //     const ingredientVariable = {name: ingredient.dataValues.name, coef: 1}
    //     const ingredientBound = { name: ingredient.dataValues.name, type: glpkInstance.GLP_LO, lb: 0}
        
    //     matrix.objective.vars.push(ingredient.dataValues.name);
    //     matrix.bounds.push(ingredientBound);
    //     equalEquation.vars.push(ingredientVariable);
    // });

    // matrix.subjectTo.push(equalEquation);

    // return {matrix, glpkInstance};
}

export default buildMatrix