function calculateIngredientPOD(ingredient){
    const { ingredientType} = ingredient;

    switch(ingredientType){
        //Milk & Spice & Cheese
        case 1, 6, 7, 8:
            return 0;
        //Sugar
        case 2:
            return ingredient.POD;
        //Fruit & Cocoa & Nut
        case 3, 4, 5:
            return ingredient.percentsugar;
        default:
            return ingredient.PAC + ingredient.percentsugar;
    }
}

export default calculateIngredientPOD;