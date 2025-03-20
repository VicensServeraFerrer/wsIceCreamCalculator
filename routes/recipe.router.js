import express from 'express';
import db, { IngredientRecipe } from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateRecipeByCalculatorDTO from '../dto/validateCreateRecipeByCalculatorDTO.js';
import buildMatrix from '../helpers/buildMatrix.js';
import getPAC from '../helpers/getPAC.js';
import validateInsertRecipeDTO from '../dto/validateInsertRecipeDTO.js';
import validateModifyRecipeDTO from '../dto/validateModifyRecipeDTO.js';

const recipeRouter = express.Router();
const { Recipe, Ingredient } = db

recipeRouter.get("/get/:recipeId", authByToken, async (req, res) => {
    const recipeId = req.params;

    try {
        const recipe = await Recipe.findOne({where: {"userId" : req.jwtData.payload.uuid, "id": recipeId}})

        if(!recipe) return res.status(400).send("This recipe doesnt exist");

        const ingredients = await IngredientRecipe.findAll({where: {"recipeId": recipeId}});

        recipe[ingredients] = [];

        ingredients.forEach( async ingredient => {
            const fullIngredient = await Ingredient.findOne({where: {"ingredientId": ingredient.ingredientId}});

            recipe.ingredients.push({
                quantity: ingredient.quantity,
                "ingredient": fullIngredient
            })
        });

        res.status(200).send(JSON.stringify(recipe));
    } catch (err) {
        res.status(400).send(err)
    }
})

recipeRouter.get("/getAll", authByToken, async (req, res) => {
    try {
        const recipes = await Recipe.findAll({where: {"userId": req.jwtData.payload.uuid}, order: [['familyId', 'ASC']]});

        res.status(200).send(recipes);
    } catch (err) {
        res.status(400).send(err);
    }
});

recipeRouter.get("/get/:familyId", authByToken, async (req, res) => {
    const familyId = req.params.familyId;

    try {
        const recipes = await Recipe.findAll({where: {"userId": req.jwtData.payload.uuid, "familyId": familyId}});

        res.status(200).send(recipes);
    } catch (err) {
        res.status(400).send(err);
    }
});

recipeRouter.post("/insert", authByToken, validateInsertRecipeDTO, async (req, res) => {
    const { name, description, familyId, TS, ingredients } = req.body;

    let newRecipe = {
        "name": name,
        "description": description,
        "userId": req.jwtData.payload.uuid,
        "familyId": familyId ? familyId : null,
        "PACTotal": 0,
        "PODTotal": 0,
        "MGTotal": 0,
        "STTotal": 0,
        "LPDTotal": 0,
        "percentCocoa": 0,
        "TS": TS,
        "price": 0
    }

    const propertiesToEvaluate = ["PAC", "POD", "MG", "ST", "LPD", "percentCocoa"];
    const recipeProperties =  ["PACTotal", "PODTotal", "MGTotal", "STTotal", "LPDTotal", "percentCocoa"];

    try {
        const ingredientIds = ingredients.map(ing => ing.id);
        const fullIngredients = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid }})

        propertiesToEvaluate.forEach((property, index) => {
            fullIngredients.forEach(ingredient => {
                newRecipe[recipeProperties[index]] +=   ingredient[property] ? 
                                                        ingredient[property]/100 * ingredients.find(ing => ing.id == ingredient.ingredientId).quantity : 0;
            })
        })

        const insertedRecipe = await Recipe.create(newRecipe);

        ingredients.forEach(async ingredient => {
            const newIngredientRecipe = {
                "ingredientId": ingredient.id,
                "recipeId": insertedRecipe.id,
                "quantity": ingredient.quantity 
            }

            await IngredientRecipe.create(newIngredientRecipe)
        })

        return res.status(200).send(insertedRecipe);
    } catch (err){
        return res.status(400).send(err)
    }

})

recipeRouter.post("/modify", authByToken, validateModifyRecipeDTO, async (req, res) => {
    const { recipeId, ingredients } = req.body;

    //modify ingredients on recipe
    try {
        ingredients.forEach(async ingredient => {
            let newIngredientRecipe = {
                "quantity": ingredient.quantity
            }

            try{
                await IngredientRecipe.update(newIngredientRecipe, {where: {"recipeId": recipeId, "ingredientId": ingredient.id}});
            } catch (err) {
                res.status(400).send(err)
            }
        })
    } catch(err) {
        res.status(400).send(err)
    }

    //recalculate recipe values
    try {
        const recipeToRecalculate = await Recipe.findOne({where: {"id": recipeId, "userId": req.jwtData.payload.uuid }})

        const ingredientsModified = await IngredientRecipe.findAll({where: {"recipeId": recipeId}});

        console.log(ingredientsModified)

        const ingredientIds = ingredientsModified.map(ing => ing.ingredientId);
        
        const ingredientData = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid }});

        let newRecipe = {
            "name": recipeToRecalculate.name,
            "description": recipeToRecalculate.description,
            "userId": recipeToRecalculate.userId,
            "familyId": recipeToRecalculate.familyId,
            "PACTotal": 0,
            "PODTotal": 0,
            "MGTotal": 0,
            "STTotal": 0,
            "LPDTotal": 0,
            "percentCocoa": 0,
            "TS":  recipeToRecalculate.TS,
            "price": 0
        }

        const propertiesToEvaluate = ["PAC", "POD", "MG", "ST", "LPD", "percentCocoa"];
        const recipeProperties =  ["PACTotal", "PODTotal", "MGTotal", "STTotal", "LPDTotal", "percentCocoa"];

        propertiesToEvaluate.forEach((property, index) => {
            ingredientData.forEach(ingredient => {
                newRecipe[recipeProperties[index]] += ingredient[property] ? 
                                                        ingredient[property]/100 * ingredientsModified.find(ing => ing.ingredientId == ingredient.ingredientId).quantity : 0;
            })
        });

        console.log(newRecipe);

        const [affectedCount, affectedRows] = await Recipe.update(newRecipe, {where: {"id": recipeId, "userId": req.jwtData.payload.uuid }})

        if(affectedCount == 0) return res.status(200).send("No se modificó ningun elemento")

        return res.status(200).send(affectedRows)
    } catch (err){
        res.status(400).send(err)
    }

})

recipeRouter.post("/calculate", authByToken, validateCreateRecipeByCalculatorDTO, async (req, res) => {
    const { ingredients } = req.body;

    
    try {
        const ingredientIds = ingredients.map(ing => ing.id);

        const fullIngredients = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid}});

        let {matrix, glpkInstance} = await buildMatrix(fullIngredients, req.body);

        let result = glpkInstance.solve(matrix);
        //console.log(result);
        res.status(200).send(JSON.stringify({matrix, result}))
        // import glpk from 'glpk.js';

// async function solveSystem() {
//     const glpkInstance = await glpk();
//
//     let model = {
//         name: "Sistema de Ingredientes",
//         objective: {
//             direction: glpkInstance.GLP_MIN, // Minimizar errores (puedes cambiarlo si quieres otra optimización)
//             name: "obj",
//             vars: [
//                 { name: "x1", coef: 1 },
//                 { name: "x2", coef: 1 },
//                 { name: "x3", coef: 1 }
//             ]
//         },
//         subjectTo: [
//             { name: "eq1", vars: [{ name: "x1", coef: 100 }, { name: "x2", coef: 5 }, { name: "x3", coef: 4 }], bnds: { type: glpkInstance.GLP_FX, ub: 280, lb: 280 } },
//             { name: "eq2", vars: [{ name: "x1", coef: 100 }, { name: "x2", coef: 5 }, { name: "x3", coef: 0 }], bnds: { type: glpkInstance.GLP_FX, ub: 180, lb: 180 } },
//             { name: "eq3", vars: [{ name: "x1", coef: 0 }, { name: "x2", coef: 0 }, { name: "x3", coef: 3.6 }], bnds: { type: glpkInstance.GLP_FX, ub: 100, lb: 100 } },
//             { name: "eq4", vars: [{ name: "x1", coef: 100 }, { name: "x2", coef: 0 }, { name: "x3", coef: 12 }], bnds: { type: glpkInstance.GLP_FX, ub: 40, lb: 40 } },
//             { name: "eq5", vars: [{ name: "x1", coef: 0 }, { name: "x2", coef: 0 }, { name: "x3", coef: 8.4 }], bnds: { type: glpkInstance.GLP_FX, ub: 80, lb: 80 } },
//             { name: "suma1000", vars: [{ name: "x1", coef: 1 }, { name: "x2", coef: 1 }, { name: "x3", coef: 1 }], bnds: { type: glpkInstance.GLP_FX, ub: 1000, lb: 1000 } }
//         ],
//         bounds: [
//             { name: "x1", type: glpkInstance.GLP_LO, lb: 0 }, // Ingredientes no pueden ser negativos
//             { name: "x2", type: glpkInstance.GLP_LO, lb: 0 },
//             { name: "x3", type: glpkInstance.GLP_LO, lb: 0 }
//         ],
//         generals: ["x1", "x2", "x3"] // Si quieres solo valores enteros
//     };

//     let result = glpkInstance.solve(model);
//     console.log("Solución óptima:", result.result.status);
//     console.log("Valores de las variables:", result.result.vars);
// }

// solveSystem();

    } catch(err){
        res.status(400).send(err)
    }
})

export default recipeRouter;
