import express from 'express';
import child_process from 'child_process';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateRecipeByCalculatorDTO from '../dto/validateCreateRecipeByCalculatorDTO.js';
import buildMatrix from '../helpers/buildMatrix.js';
import validateInsertRecipeDTO from '../dto/validateInsertRecipeDTO.js';
import validateModifyRecipeDTO from '../dto/validateModifyRecipeDTO.js';

const recipeRouter = express.Router();
const { Recipe, Ingredient, User, UserRelation, IngredientRecipe } = db
const { spawn } = child_process;

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
        const userReq = await User.findOne({where: {"uuid": req.jwtData.payload.uuid}});

        if(userReq.userType == 2){
            const recipes = await Recipe.findAll({where: {"userId": req.jwtData.payload.uuid}, order: [['familyId', 'ASC']]});
            
            return res.status(200).send(recipes);
        } else {
            const userIdsRelated = await UserRelation.findAll({where: {"tUserId": req.jwtData.payload.uuid}});

            const userIds = userIdsRelated.map(usr => usr.gUserId);
            userIds.push(req.jwtData.payload.uuid);

            const recipes = await Recipe.findAll({where: {"userId": userIds}, order: [['userId', 'ASC']]});

            return res.status(200).send(recipes);
        }
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
    console.log("llego aqui!!!!!!!!!!!!!!!")
    const { ingredients } = req.body;

    
    try {
        
        const ingredientIds = ingredients.map(ing => ing.id);

        const fullIngredients = await Ingredient.findAll({where: {"ingredientId": ingredientIds, "userId": req.jwtData.payload.uuid}});

        let { matrixA, matrixB, ingredientNames } = await buildMatrix(fullIngredients, req.body);
        
        const parameters_py = {
                    "matrixA": Object.values(matrixA),
                    "matrixB": Object.values(matrixB).flat(),
                    "ingredientNames": ingredientNames
        }

        const python = spawn('python3', ['../TFG/helpers/solver.py']);
        
        python.stdin.write(JSON.stringify(parameters_py));
        
        python.stdin.end();

        let output = "";
        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            console.error(`🐍 Error desde Python: ${data.toString()}`);
        });

        python.on("close", (code) => {
            console.log(`🔍 Python finalizó con código ${code}`);
            if (code !== 0) {
                console.error("❌ Hubo un error en la ejecución del script Python");
            } else {
                console.log("✅ Python se ejecutó correctamente");
                console.log(matrixA); 
                res.json(JSON.parse(output)); // solo si todo fue bien
            }
        });



        //res.status(200).send(output);//JSON.stringify(parameters_py));
    } catch(err){
        res.status(400).send(err)
    }
})

export default recipeRouter;
