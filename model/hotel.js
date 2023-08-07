<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');


const Hotel = db.define('hotel', {
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
    amenities:{
        type: Sequelize.TEXT
    },
    location: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.FLOAT
    }
}, {timestamps: true});

=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');


const Hotel = db.define('hotel', {
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
    amenities:{
        type: Sequelize.TEXT
    },
    location: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.FLOAT
    }
}, {timestamps: true});

>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = Hotel;