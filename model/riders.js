<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Rider = db.define('rider', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    fullname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phone_no: {
        type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING  
    },
    address: {
        type: Sequelize.STRING
    },
},
{timestamps: true});

module.exports = Rider;
=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const Rider = db.define('rider', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    fullname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phone_no: {
        type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING  
    },
    address: {
        type: Sequelize.STRING
    },
},
{timestamps: true});

module.exports = Rider;
>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
