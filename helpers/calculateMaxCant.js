import calculateIngredientPAC from "./calculateIngredientPAC.js";

function calculateMaxCant(ingredient, temperature){
    const referencePAC = temperature == -11 ? 270 : 410;

    const pacIngredient = calculateIngredientPAC(ingredient);

    return (referencePAC - 150) / pacIngredient; 
}

export default calculateMaxCant;