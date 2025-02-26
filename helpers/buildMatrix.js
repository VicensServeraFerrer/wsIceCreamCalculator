let matrix = {
    PAC: [],
    POD: [],
    MG: [],
    ST: [],
    LPD: [],
    percentCocoa: []
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