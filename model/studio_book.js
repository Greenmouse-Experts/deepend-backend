<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Studio = db.define('studio', {
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
    location: {
        type: Sequelize.STRING
    },
    per_time: {
        type: Sequelize.STRING
    },
    equipment: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING,
    }, 
    rating: {
        type: Sequelize.FLOAT
    }
}, {timestamps: true});

=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Studio = db.define('studio', {
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
    location: {
        type: Sequelize.STRING
    },
    per_time: {
        type: Sequelize.STRING
    },
    equipment: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING,
    }, 
    rating: {
        type: Sequelize.FLOAT
    }
}, {timestamps: true});

>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = Studio;