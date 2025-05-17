const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Construir la ruta correcta al archivo .env en ../config/.env
const envPath = path.resolve(__dirname, '../config/.env');

// Cargar las variables de entorno desde el archivo .env
dotenv.config({ path: envPath });

// Configurar la conexión a la base de datos
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
});

// Modelos
const UserType = sequelize.define('UserType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typeName: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define('User', {
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    userName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNum: { type: DataTypes.STRING },
    userType: { type: DataTypes.INTEGER, allowNull: false, references: { model: UserType, key: 'id' } },
});

const UserRelation = sequelize.define("UserRelation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

const Family = sequelize.define('Family', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'uuid' } },  // Actualizar a UUID
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
});

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    familyId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Family, key: 'id' } },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'uuid' } },  // Actualizar a UUID
    description: { type: DataTypes.STRING },
    PACTotal: { type: DataTypes.FLOAT },
    PODTotal: { type: DataTypes.FLOAT },
    MGTotal: { type: DataTypes.FLOAT },
    STTotal: { type: DataTypes.FLOAT },
    LPDTotal: { type: DataTypes.FLOAT },
    percentCocoa: { type: DataTypes.FLOAT },
    TS: { type: DataTypes.INTEGER },
    price: { type: DataTypes.FLOAT },
});

const Ingredient = sequelize.define('Ingredient', {
    ingredientId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'uuid' } },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    ST: { type: DataTypes.FLOAT },
    LPD: { type: DataTypes.FLOAT },
    MG: { type: DataTypes.FLOAT },
    PAC: { type: DataTypes.FLOAT },
    POD: { type: DataTypes.FLOAT },
    percentsugar: { type: DataTypes.FLOAT },
    percentCocoa: { type: DataTypes.FLOAT },
    percentCocoaButter: { type: DataTypes.FLOAT },
    CantMax18: { type: DataTypes.FLOAT },
    CantMax11: { type: DataTypes.FLOAT },
    proportion: { type: DataTypes.FLOAT },
    percentsalt: { type: DataTypes.FLOAT },
    grade: { type: DataTypes.FLOAT },
    orientativeQuantity: { type: DataTypes.FLOAT },
});

const Type = sequelize.define('Type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

const IngredientRecipe = sequelize.define('IngredientRecipe', {
    ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'ingredientId' } },
    recipeId: { type: DataTypes.INTEGER, references: { model: Recipe, key: 'id' } },
    quantity: { type: DataTypes.FLOAT },
});

const Provider = sequelize.define('Provider', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'uuid' } },
    name: { type: DataTypes.STRING, allowNull: false },
    tlf: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
});

const IngredientProvider = sequelize.define('IngredientProvider', {
    ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'ingredientId' } },
    providerId: { type: DataTypes.INTEGER, references: { model: Provider, key: 'id' } },
    price: { type: DataTypes.FLOAT },
});

const Allergen = sequelize.define('Allergen', {
    allergenId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING },
    img: { type: DataTypes.BLOB },
});

const IngredientAllergen = sequelize.define('IngredientAllergen', {
    ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'ingredientId' } },
    allergenId: { type: DataTypes.INTEGER, references: { model: Allergen, key: 'allergenId' } },
});

// Relaciones

UserType.hasMany(User, { foreignKey: 'userType' });
User.hasMany(Family, { foreignKey: 'userId' });
User.hasMany(Ingredient, { foreignKey: 'userId' });
User.hasMany(Recipe, { foreignKey: 'userId' });
User.hasMany(Provider, { foreignKey: 'userId' });
User.belongsToMany(User, {as: "TUsers", through: UserRelation, foreignKey: "tUserId", otherKey: "gUserId"});
User.belongsToMany(User, {as: "GUsers", through: UserRelation, foreignKey: "gUserId", otherKey: "tUserId"});
Family.hasMany(Recipe, { foreignKey: 'familyId' });
Type.hasMany(Ingredient, {foreignKey: 'ingredientType'});
Recipe.belongsToMany(Ingredient, { through: IngredientRecipe, foreignKey: 'recipeId' });
Ingredient.belongsToMany(Recipe, { through: IngredientRecipe, foreignKey: 'ingredientId' });
Ingredient.belongsToMany(Allergen, { through: IngredientAllergen, foreignKey: 'ingredientId' });
Allergen.belongsToMany(Ingredient, { through: IngredientAllergen, foreignKey: 'allergenId' });
Ingredient.belongsToMany(Provider, { through: IngredientProvider, foreignKey: 'ingredientId' });
Provider.belongsToMany(Ingredient, { through: IngredientProvider, foreignKey: 'providerId' });


// Sincronizar modelos
(async () => {
    try {
        await sequelize.sync({alter: true}); // Forzar sincronización para desarrollo
        console.log('Base de datos sincronizada.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
})();

module.exports = {
    sequelize,
    UserType,
    User,
    UserRelation,
    Family,
    Recipe,
    Ingredient,
    IngredientRecipe,
    Provider,
    IngredientProvider,
    Allergen,
    IngredientAllergen,
    Type,
};
