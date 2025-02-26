import express from 'express';
import dotenv from "dotenv";
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import ingredientRouter from './routes/ingredient.router.js';
import providerRouter from './routes/provider.router.js';
import allergenRouter from './routes/allergen.router.js';
import recipeRouter from './routes/recipe.router.js';
import familyRouter from './routes/family.router.js';

dotenv.config();

const PORT =  3000;
const expressApp = express()

expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use("/user", userRouter);
expressApp.use("/auth", authRouter);
expressApp.use("/ingredient", ingredientRouter);
expressApp.use("/provider", providerRouter);
expressApp.use("/allergen", allergenRouter);
expressApp.use("/recipe", recipeRouter);
expressApp.use("/family", familyRouter);


expressApp.listen(PORT, () => {
    console.log(`Servidor levantado en ${PORT}`);
})