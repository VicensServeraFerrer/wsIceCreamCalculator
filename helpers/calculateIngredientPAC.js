
function calculateIngredientPAC(ingredient){
    const { ingredientType } = ingredient;

    switch(ingredientType){
        //Milk & Sugar
        case 1, 2:
            return ingredient.PAC;
        //Fruit
        case 3:
            return ingredient.percentsugar * 1;
        //Cocoa
        case 4:
            return ingredient.percentsugar + (ingredient.percentCocoa * -1.8) + (ingredient.percentCocoaButter * -0.9);
        //Nut
        case 5:
            return ingredient.percentsugar + (ingredient.MG + -1.4);
        //Spice
        case 6:
            return null;
        //Cheese & salty
        case 7, 8:
            return ingredient.PAC + ingredient.percentsalt;
        //Alcohol
        case 9:
            return ingredient.percentsugar + (ingredient.grade * 9);
        //Generic
        default:
            const PAC = ingredient.PAC ? ingredient.PAC : 0;
            const MGV = ingredient.MGV ? ingredient.MGV * -1.4 : 0;
            const percentCocoa = ingredient.percentCocoa ? ingredient.percentCocoa * -1.8 : 0;
            const percentCocoaButter = ingredient.percentCocoaButter ? ingredient.percentCocoaButter * -0.9 : 0;
            const percentsugar = ingredient.percentsugar ? ingredient.percentsugar * 1 : 0;
            const grade = ingredient.grade ? ingredient.grade * 9 : 0;

            return PAC + MGV + percentCocoa + percentCocoaButter + percentsugar + grade;
    }
}

export default calculateIngredientPAC;