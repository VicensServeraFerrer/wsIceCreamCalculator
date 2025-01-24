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
        PAC: 0, //Hacer gestion
        POD: 0, //hacer gestion
        percentsugar: ingredient.percentsugar ? ingredient.percentsugar : null,
        percentCocoa: ingredient.percentCocoa ? ingredient.percentCocoa : null,
        percentCocoaButter: ingredient.percentCocoaButter ? ingredient.percentCocoaButter : null,
        CantMax18: null, //hacer gestion
        CantMas11: null, //Hacer gestion
        proportion: ingredient.proportion ? ingredient.proportion : null,
        percentsalt: ingredient.percentsalt ? ingredient.percentsalt : null,
        grade: ingredient.grade ? ingredient.grade : null,
        orientativeQuantity: ingredient.orientativeQuantity ? ingredient.orientativeQuantity : null,
    }

    req.completeIngredient = completeIngredient;

    next();
}