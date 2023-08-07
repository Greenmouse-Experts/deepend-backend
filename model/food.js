<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Food = db.define('food', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.STRING,
    }
}, {timestamps: true});


=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Food = db.define('food', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.STRING,
    }
}, {timestamps: true});


>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = Food;