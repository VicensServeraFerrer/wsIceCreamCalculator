import express from 'express';
import db from '../database/db_schema.cjs';
import authByToken from '../helpers/authByToken.js';
import validateCreateProviderDTO from '../dto/validateCreateProviderDTO.js';
import validateAsociationInProDTO from '../dto/validateAsociatonInProDTO.js';

const providerRouter = express.Router();
const { Provider, IngredientProvider } = db;


providerRouter.get("/getAll", authByToken, async (req, res) => {
    const providers = await Provider.findAll({where: {"userId": req.jwtData.payload.uuid}})

    if(!providers) res.status(200).send("No tienes proveedores");

    return res.status(200).send(JSON.stringify({"providers": providers}));
});

//Mediante el body de la request crea un proveedor en la base de datos
providerRouter.post("/create", authByToken, validateCreateProviderDTO, async (req, res) => {
    const provider = req.body;

    provider["userId"] = req.jwtData.payload.uuid;

    const newProvider = await Provider.create(provider)

    if(!newProvider) return res.status(400).send("No se pudo crear al proveedor");
    
    res.status(200).send(JSON.stringify(newProvider));
});

//Mediante el body de la request asocia un proveedor con un ingrediente
providerRouter.post("/asociate", authByToken, validateAsociationInProDTO, async (req, res) => {
    const {ingredientId, providerId} = req.body;

    const asociationExists = await IngredientProvider.findOne({where: {"ingredientId": ingredientId, "providerId": providerId}});

    if(asociationExists) return res.status(400).send("La asociacion ya existe");

    try{
        const newAsociation = await IngredientProvider.create(req.body);
        
        res.status(200).send(JSON.stringify(newAsociation));
    } catch(err){
        res.status(400).send(err);
    }
});

export default providerRouter;
