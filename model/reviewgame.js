<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Game = require('./vr_gaming');
const User = require('./user');

const GameReview = db.define('gamereview', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'users',
            key: 'id',
        }
    },
    gameId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'gamings',
            key: 'id',
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validator:{
            min: 0,
            max: 5
        }
    },
    comment: {
        type: Sequelize.TEXT,
        defaultValue: null
    }
    
});


GameReview.belongsTo(Game, {foreignKey: 'gameId'})
Game.hasMany(GameReview, {foreignKey: 'gameId'});

GameReview.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(GameReview, {foreignKey: 'userId'});

=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Game = require('./vr_gaming');
const User = require('./user');

const GameReview = db.define('gamereview', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'users',
            key: 'id',
        }
    },
    gameId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'gamings',
            key: 'id',
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validator:{
            min: 0,
            max: 5
        }
    },
    comment: {
        type: Sequelize.TEXT,
        defaultValue: null
    }
    
});


GameReview.belongsTo(Game, {foreignKey: 'gameId'})
Game.hasMany(GameReview, {foreignKey: 'gameId'});

GameReview.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(GameReview, {foreignKey: 'userId'});

>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = GameReview;