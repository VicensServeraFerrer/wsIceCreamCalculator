import getPAC from "./getPAC.js";

async function buildMatrix(ingredients, bounds){
    const matrixA = {
        PAC: [],
        POD: [],
        MG: [],
        ST: [],
        LPD: [],
        percentCocoa: [],
        limit: []
    }
    
    const matrixB = {
        PAC: [],
        POD: [],
        MG: [],
        ST: [],
        LPD: [],
        percentCocoa: [],
        limit: []
    }

    const keyNames = Object.keys(matrixA);
    const ingredientIds = [];
    const fixedQuantities = [];

    keyNames.forEach(key => {
        if(key == 'PAC'){
            const PAC = getPAC(bounds.TS);
            matrixB[key].push(PAC.PACub);
        } else if(key == 'limit'){
            matrixB[key] = 1000;
        }else {
            matrixB[key].push(bounds[key] ? bounds[key] : 0);
        }

        ingredients.forEach(ingredient => {
            if(ingredient.dataValues.quantity == 0){
                if(key == 'limit'){
                    matrixA[key].push(1);
                } else {
                    matrixA[key].push(ingredient.dataValues[key] ? ingredient.dataValues[key]/100 : 0);
                }
                if(!ingredientIds.includes(ingredient.dataValues.ingredientId)) ingredientIds.push(ingredient.dataValues.ingredientId);
            } else {
                if(key == 'limit') {
                    matrixB[key] -= ingredient.dataValues.quantity;
                } else {
                    matrixB[key] -= ingredient.dataValues[key] ? (ingredient.dataValues[key]/100)*ingredient.dataValues.quantity : 0;
                }
                const fixedQuantity = {"id": ingredient.dataValues.ingredientId, "quantity": ingredient.dataValues.quantity}
                if(!fixedQuantities.find(fx => fx.id == fixedQuantity.id)) fixedQuantities.push(fixedQuantity);
            }
        });
    });
 
    return { 
            "matrixA": matrixA, 
            "matrixB": matrixB,
            "orderedIngIds": ingredientIds,
            "fixedQuantities": fixedQuantities
         }; 
}

export default buildMatrix