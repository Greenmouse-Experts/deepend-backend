const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Game = db.define('gaming', {
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
        type: Sequelize.STRING
    },
    genre: {
        type: Sequelize.STRING
    },
    per_time:{
        type: Sequelize.STRING
    },
    available_game:{
        type: Sequelize.INTEGER
    },
    age_rate: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING,
    }
}, {timestamps: true});

module.exports = Game;