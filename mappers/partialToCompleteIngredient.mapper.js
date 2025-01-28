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
        LPD: ingredient.LPD ? ingredient.LPD : null,
        MG: ingredient.MG ? ingredient.LPD : null,
        PAC: calculateIngredientPAC(ingredient),
        POD: calculateIngredientPOD(ingredient), 
        percentsugar: ingredient.percentsugar ? ingredient.percentsugar : null,
        percentCocoa: ingredient.percentCocoa ? ingredient.percentCocoa : null,
        percentCocoaButter: ingredient.percentCocoaButter ? ingredient.percentCocoaButter : null,
        CantMax18: ingredient.ingredientType == 9 ? calculateMaxCant(ingredient, -18) : null, 
        CantMax11: ingredient.ingredientType == 9 ? calculateMaxCant(ingredient, -11) : null, 
        proportion: ingredient.proportion ? ingredient.proportion : null,
        percentsalt: ingredient.percentsalt ? ingredient.percentsalt : null,
        grade: ingredient.grade ? ingredient.grade : null,
        orientativeQuantity: ingredient.orientativeQuantity ? ingredient.orientativeQuantity : null,
    }

    req.completeIngredient = completeIngredient;

    next();
}


export default partialToCompleteIngredientMapper;