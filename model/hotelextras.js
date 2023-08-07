<<<<<<< HEAD
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Hotel = require('./hotel');
//const Cart = require('./cart')

const HotelExtra = db.define('hotelextra', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    hotelId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'hotels',
            key: 'id',
        }
    },
    available_room:{
        type: Sequelize.INTEGER
    },
    room:{
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.TEXT
    }
    
});


HotelExtra.belongsTo(Hotel, {foreignKey: 'hotelId'})
Hotel.hasMany(HotelExtra, {foreignKey: 'hotelId'});

=======
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const Hotel = require('./hotel');
//const Cart = require('./cart')

const HotelExtra = db.define('hotelextra', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    hotelId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'hotels',
            key: 'id',
        }
    },
    available_room:{
        type: Sequelize.INTEGER
    },
    room:{
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.TEXT
    }
    
});


HotelExtra.belongsTo(Hotel, {foreignKey: 'hotelId'})
Hotel.hasMany(HotelExtra, {foreignKey: 'hotelId'});

>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
module.exports = HotelExtra;