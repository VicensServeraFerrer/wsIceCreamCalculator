import express from 'express';
import db from '../database/db_schema.cjs';
import authRouter from './auth.router';

const ingredientRouter = express.Router();

ingredientRouter.post("/create", (req, res) => {
    
});