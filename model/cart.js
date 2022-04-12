const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const User = require('./user');
const CartItem = require('./cartitem')

const Cart = db.define('cart', {
    id :{
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userid: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'users',
            key: 'id',
        }
    },
    cartitemid: {
        type: Sequelize.STRING(10),
        references:{ 
            model: 'cartitems',
            key: 'id',
        }
    }

},{
    timestamps: true
});

Cart.belongsTo(User, {foreignKey: 'userid'})
User.hasMany(Cart, {foreignKey: 'userid'});
Cart.hasMany(CartItem, {foreignKey: 'cartitemid'})
CartItem.belongsTo(Cart, {foreignKey: 'cartitemid'})


module.exports = Cart;