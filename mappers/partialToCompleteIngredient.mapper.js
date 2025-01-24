import calculateIngredientPAC from "../helpers/calculateIngredientPAC";
import calculateIngredientPOD from "../helpers/calculateIngredientPOD";
import calculateMaxCant from "../helpers/calculateMaxCant";

function partialToCompleteIngredientMapper(req, res, next)
{
    const ingredient = req.body;

    const completeIngredient = {
        userId: req.jwt.payload.guid,
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
        CantMax18: ingredientType == 9 ? calculateMaxCant(ingredient, -18) : null, 
        CantMax11: ingredientType == 9 ? calculateMaxCant(ingredient, -11) : null, 
        proportion: ingredient.proportion ? ingredient.proportion : null,
        percentsalt: ingredient.percentsalt ? ingredient.percentsalt : null,
        grade: ingredient.grade ? ingredient.grade : null,
        orientativeQuantity: ingredient.orientativeQuantity ? ingredient.orientativeQuantity : null,
    }

    req.completeIngredient = completeIngredient;

    next();
}