import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateRecipeByCalculatorDTO from '../dto/validateCreateRecipeByCalculatorDTO.js';
import buildMatrix from '../helpers/buildMatrix.js';
import getPAC from '../helpers/getPAC.js';
import * as math from 'mathjs'

const recipeRouter = express.Router();
const { Recipe, Ingredient } = db

recipeRouter.post("/calculate", authByToken, validateCreateRecipeByCalculatorDTO, async (req, res) => {
    const { ingredients } = req.body;

    
    try {
        const ingredientIds = ingredients.map(ing => ing.id);

        const fullIngredients = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid}});

        let matrix = buildMatrix(fullIngredients, req.body);

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


        console.log(finalSolution)

    } catch(err){
        res.status(400).send(err)
    }
})

export default recipeRouter;
