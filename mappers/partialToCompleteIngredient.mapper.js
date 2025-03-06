import calculateIngredientPAC from "../helpers/calculateIngredientPAC.js";
import calculateIngredientPOD from "../helpers/calculateIngredientPOD.js";
import calculateMaxCant from "../helpers/calculateMaxCant.js";

function partialToCompleteIngredientMapper(req, res, next)
{
    const ingredient = req.body;

    const completeIngredient = {
        userId: req.jwtData.payload.uuid,
        name: ingredient.name,
        description: ingredient.description,
        ingredientType: ingredient.ingredientType,
        ST: ingredient.ST,
        LPD: ingredient.LPD ? ingredient.LPD : 0,
        MG: ingredient.MG ? ingredient.MG : 0,
        PAC: calculateIngredientPAC(ingredient),
        POD: calculateIngredientPOD(ingredient), 
        percentsugar: ingredient.percentsugar ? ingredient.percentsugar : 0,
        percentCocoa: ingredient.percentCocoa ? ingredient.percentCocoa : 0,
        percentCocoaButter: ingredient.percentCocoaButter ? ingredient.percentCocoaButter : 0,
        CantMax18: ingredient.ingredientType == 9 ? calculateMaxCant(ingredient, -18) : 0, 
        CantMax11: ingredient.ingredientType == 9 ? calculateMaxCant(ingredient, -11) : 0, 
        proportion: ingredient.proportion ? ingredient.proportion : 0,
        percentsalt: ingredient.percentsalt ? ingredient.percentsalt : 0,
        grade: ingredient.grade ? ingredient.grade : 0,
        orientativeQuantity: ingredient.orientativeQuantity ? ingredient.orientativeQuantity : 0,
    }

    req.completeIngredient = completeIngredient;

    next();
}


export default partialToCompleteIngredientMapper;