<<<<<<< HEAD
// const Sequelize = require('sequelize');
// const db = require('../config/config');
// const {nanoid} = require('nanoid');
// const Hotel = require('./hotel');
// //const Cart = require('./cart')

// const HotelAmenities = db.define('hotelamenity', {
//     id: {
//         type: Sequelize.STRING(10),
//         autoincrement: false,
//         allowNull: false,
//         primaryKey: true,
//         defaultValue: () => nanoid(10)
//     },
//     hotelId: {
//         type: Sequelize.STRING(10),
//         references:{ 
//             model: 'hotels',
//             key: 'id',
//         }
//     },
//    amenities: {
//         type: Sequelize.STRING,
//    }
    
// });


// HotelAmenities.belongsTo(Hotel, {foreignKey: 'hotelId'})
// Hotel.hasMany(HotelAmenities, {foreignKey: 'hotelId'});

=======
// const Sequelize = require('sequelize');
// const db = require('../config/config');
// const {nanoid} = require('nanoid');
// const Hotel = require('./hotel');
// //const Cart = require('./cart')

// const HotelAmenities = db.define('hotelamenity', {
//     id: {
//         type: Sequelize.STRING(10),
//         autoincrement: false,
//         allowNull: false,
//         primaryKey: true,
//         defaultValue: () => nanoid(10)
//     },
//     hotelId: {
//         type: Sequelize.STRING(10),
//         references:{ 
//             model: 'hotels',
//             key: 'id',
//         }
//     },
//    amenities: {
//         type: Sequelize.STRING,
//    }
    
// });


// HotelAmenities.belongsTo(Hotel, {foreignKey: 'hotelId'})
// Hotel.hasMany(HotelAmenities, {foreignKey: 'hotelId'});

>>>>>>> 3604926e3bcaa891553f07c089fc691e7998ba48
// module.exports = HotelAmenities;