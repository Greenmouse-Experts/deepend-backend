const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const User = require('./user');
const Food = require('./food');
const FoodExtra = require('./foodextras');
const FoodOrder = require('./foodorder');

const CartItem = db.define('fooditem', {
    id :{
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'users',
            key: 'id',
        }
    },
    foodId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'food',
            key: 'id',
        }
    },
    foodextrasId: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'foodextras',
            key: 'id',
        }
    },
    orderId:{
        type: Sequelize.STRING(10),
        references:{ 
            model: 'foodorders',
            key: 'id',
        }
    },
    qty:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    price:{
        type: Sequelize.BIGINT
    }

},{
    timestamps: true
});

CartItem.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(CartItem, {foreignKey: 'userId'});

CartItem.hasMany(Food, {foreignKey: 'foodId'})
Food.belongsTo(CartItem, {foreignKey: 'foodId'})

CartItem.hasMany(FoodExtra, {foreignKey: 'foodextrasId'});
FoodExtra.belongsTo(CartItem, {foreignKey: 'foodextrasId'});

FoodOrder.hasMany(CartItem, {foreignKey: 'orderId'});
CartItem.belongsTo(FoodOrder, {foreignKey: 'orderId'});


module.exports = Cart;