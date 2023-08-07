<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const User = require('./user');

const Ads = db.define('ads', {
    id :{
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    title: {
        type: Sequelize.STRING
    },
    ref_link: {
        type: Sequelize.STRING
    },
    img_id: {
        type: Sequelize.STRING
    },
    img_url:{
        type: Sequelize.STRING
    }
}, {timestamps: true});

// Ads.belongsTo(User, {foreignKey: 'userid'})
// User.hasMany(Ads, {foreignKey: 'userid'});


=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const User = require('./user');

const Ads = db.define('ads', {
    id :{
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    title: {
        type: Sequelize.STRING
    },
    ref_link: {
        type: Sequelize.STRING
    },
    img_id: {
        type: Sequelize.STRING
    },
    img_url:{
        type: Sequelize.STRING
    }
}, {timestamps: true});

// Ads.belongsTo(User, {foreignKey: 'userid'})
// User.hasMany(Ads, {foreignKey: 'userid'});


>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = Ads