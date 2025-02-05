function calculateIngredientPOD(ingredient){
    const { ingredientType } = ingredient;
    console.log(ingredientType);

    switch(ingredientType){
        //Milk & Spice & Cheese
        case 1:
        case 6:
        case 7:
        case 8:
            return 0;
        //Sugar
        case 2:
            return ingredient.POD;
        //Fruit & Cocoa & Nut
        case 3:
        case 4:
        case 5:
            return ingredient.percentsugar;
        default:
            return ingredient.PAC + ingredient.percentsugar;
    }
}

export default calculateIngredientPOD;