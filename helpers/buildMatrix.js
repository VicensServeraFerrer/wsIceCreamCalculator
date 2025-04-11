import getPAC from "./getPAC.js";

async function buildMatrix(ingredients, bounds){
    const matrixA = {
        PAC: [],
        POD: [],
        MG: [],
        ST: [],
        LPD: [],
        percentCocoa: []
    }
    
    const matrixB = {
        PAC: [],
        POD: [],
        MG: [],
        ST: [],
        LPD: [],
        percentCocoa: []
    }

    const keyNames = Object.keys(matrixA);
    const ingredientIds = [];

    keyNames.forEach(key => {
        if(key == 'PAC'){
            const PAC = getPAC(bounds.TS);
            matrixB[key].push(PAC.PACub);
        } else {
            matrixB[key].push(bounds[key]);
        }

        ingredients.forEach(ingredient => {
            matrixA[key].push(ingredient.dataValues[key] ? ingredient.dataValues[key]/100 : 0);
            if(!ingredientIds.includes(ingredient.dataValues.ingredientId)) ingredientIds.push(ingredient.dataValues.ingredientId);
        })
    })
 
    return { 
            "matrixA": matrixA, 
            "matrixB": matrixB,
            "orderedIngIds": ingredientIds
         }; 
}

export default buildMatrix