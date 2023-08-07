<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Food = require('./food');

const FoodExtra = db.define('foodpackaging', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    foodId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'food',
            key: 'id',
        }
    },
    name: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.BIGINT
    }
    
});


FoodExtra.belongsTo(Food, {foreignKey: 'foodId'})
Food.hasMany(FoodExtra, {foreignKey: 'foodId'});

module.exports = FoodExtra;
=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Food = require('./food');

const FoodPackaging = db.define('foodpackaging', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    foodId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'food',
            key: 'id',
        }
    },
    name: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.BIGINT
    }
});


FoodPackaging.belongsTo(Food, {foreignKey: 'foodId'})
Food.hasMany(FoodPackaging, {foreignKey: 'foodId'});

module.exports = FoodPackaging;
>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
