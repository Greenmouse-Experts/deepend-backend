const Product = require('../../model/hotel');
const Image = require("../../model/hotelimage")
const cloudinary = require('../../util/cloudinary');
const Review = require("../../model/reviewhotel")
const User = require('../../model/user');
// const Amenity = require('../../model/amenities');
const Extras = require('../../model/hotelextras')
const HotelBooking = require("../../model/hotelbooking");

const fs = require('fs')
const store = require('store')

exports.createHotelService = async(req, res, next) => {
    const { title, description, location, rating} = req.body;
    try {

        const hotel = new Product({
            userid: req.user.id,
            title,
            description,
            amenities: req.body.amenities,
            location,
            rating: parseFloat(rating),
        })
        var hotelout = await hotel.save();

        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'hotelImages');
            
                const urls = [];
                const ids = []
                const files = req.files;
                for (const file of files){
                    const { path } = file;
                    const newPath = await uploader(path)
                    console.log(newPath)
                    urls.push(newPath.url);
                    ids.push(newPath.id)
                    fs.unlinkSync(path)
                }

                var hotelimage = (id, url)=>{
                    var imageoutput = []
                    for(let i=0; i<id.length; i++){
                        imageoutput.push({
                            hotelId: hotelout.id,
                            img_id: id[i],
                            img_url: url[i]
                        });
                    }
                    return imageoutput;
                }

                await Image.bulkCreate(hotelimage(ids, urls), {returning: true});
            }
            

            // if(req.body.amenities){
            //     const amenities = req.body.amenities.map((amenity) => {
            //         return {
            //             hotelId: hotelout.id,
            //             amenities: amenity
            //         }
            //     })
            //     console.log(amenities)
            //    await Amenity.bulkCreate(amenities, {returning: true})
            // }
console.log(req.body.available_room)
            if(req.body.room && req.body.price && req.body.available_room){
                if(Array.isArray(req.body.room)){
                    var room_price = (room, price, available)=>{
                    var output = []
                    for(let i = 0; i<room.length; i++){
                        output.push({
                            hotelId: hotelout.id,
                            room: room[i],
                            price: price[i],
                            available_room: available[i]
                        }); 
                    };
                    return output;
                }
                }else{
                    room_price = (room, price, available)=>{
                        var output = [];
                        output.push({
                            hotelId: hotelout.id,
                            room: room,
                            price: price,
                            available_room: available
                        }); 
                        return output;
                    }
                }
                
                
                // console.log(room_price(req.body.room, req.body.price));
                await Extras.bulkCreate(room_price(req.body.room, req.body.price, req.body.available_room), {returning: true})
            }
            
            var output = await Product.findOne({ where: {id: hotelout.id},
               include:[
                    // {
                    //     model: Amenity,
                    //     attributes: {
                    //         exclude: ["createdAt", "updatedAt"]
                    //     }
                    // },
                    {
                        model: Extras,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                    {
                        model: Image,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ]});

                res.redirect("/dashboard/admin/get-hotel-posts")

        
    } catch (error) {
         console.error(error)
        next(error);
    }
}

exports.getHotelAppServices = async(req, res, next) => {
    try {
        const length = req.query.length;
        var hotel = await Product.findAll({
        order: [
            ['rating', 'ASC']
        ], include:[
            // {
            //     model: Amenity,
            //     attributes: {
            //         exclude: ["createdAt", "updatedAt"]
            //     }
            // },
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Review,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include:[
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                    }
                ]
            }
        ]});

        if(hotel){
            if(hotel.length <= length || length === "" || !length){
                
                res.status(200).json({
                    status: true,
                    data: hotel
                });
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = hotel.slice(begin, end)
                res.status(200).json({
                    status: true,
                    data: sliced
                });
            }
        } else{
            res.status(404).json({
                status: true,
                message: "Posts not Found"
            })
        }
    } catch (error) {
        console.error(error)
        next(error);
    }
}

exports.getHotelServices = async(req, res, next) => {
    try {
        const length = req.query.length;
        var hotel = await Product.findAll({
        order: [
            ['rating', 'ASC']
        ], include:[
            // {
            //     model: Amenity,
            //     attributes: {
            //         exclude: ["createdAt", "updatedAt"]
            //     }
            // },
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Review,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include:[
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                    }
                ]
            }
        ]});

        if(hotel){
            if(hotel.length <= length || length === "" || !length){
                
                console.log("hotels found")
                store.set("hotel", JSON.stringify(hotel));
                      let name = req.user.fullname.split(" ");
                      let email = req.user.email;
                      data = JSON.parse(store.get("hotel"));
                      console.log(data)
                      res.render("dashboard/admin/hotels", {
                        user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                        email: email,
                        data: data
                      });
                      next();
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = hotel.slice(begin, end)
                console.log("hotels found")
                store.set("hotel", JSON.stringify(hotel));
                      let name = req.user.fullname.split(" ");
                      let email = req.user.email;
                      data = JSON.parse(store.get("hotel"));
                      console.log(data)
                      res.render("dashboard/admin/hotels", {
                        user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                        email: email,
                        data: data
                      });
                      next();
            }
        } else{
            console.log("No hotels found")
            store.set("hotel", JSON.stringify(hotel));
                  let name = req.user.fullname.split(" ");
                  let email = req.user.email;
                  data = JSON.parse(store.get("hotel"));
                  console.log(data)
                  res.render("dashboard/admin/hotels", {
                    user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                    email: email,
                    data: data
                  });
                  next();
        }
    } catch (error) {
        console.error(error)
        next(error);
    }
}

exports.hotelCount = async (rea, res, next)=>{
    try {
        const hotels = await Product.count()
        if (hotels){
            store.set("hotels", hotels);
            console.log('hotels found:', hotels)
           
                next();
           
        } else{
          console.log("no hotels", hotels)
          store.set("hotels", hotels);
                
                next();
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: false,
            message: "An error occured refresh the page"
        })
        next(error)
        // req.flash("error", "An error occured refresh the page")
    }
}

// exports.getHotelForUser = async(req, res, next) => {
//     try {
//         var hotel = await Product.findAll({ where: {
//             userid: req.user.id,
//             productType: 'hotel'
//         }, include:[
//             {
//                 model: User,
//                 attributes: {
//                     exclude: ["createdAt", "updatedAt"]
//                 }
//             },
//             // {
//             //     model: Amenity,
//             //     attributes: {
//             //         exclude: ["createdAt", "updatedAt"]
//             //     }
//             // },
//             {
//                 model: Extras,
//                 attributes: {
//                     exclude: ["createdAt", "updatedAt"]
//                 }
//             },
//             {
//                 model: Review,
//                 attributes: {
//                     exclude: ["createdAt", "updatedAt"]
//                 }
//             }
//         ]})
        
//         if(hotel){
//             for(let i=0; i<hotel.length; i++){
//                 hotel[i].img_id = JSON.parse(hotel[i].img_id);
//                 hotel[i].img_url = JSON.parse(hotel[i].img_url);
//                 // hotel[i].amenities = JSON.parse(hotel[i].amenities);
//                 // hotel[i].room_pricing = JSON.parse(hotel[i].room_pricing);
//             }
//             res.status(200).json({
//                 status: true,
//                 data: hotel
//             });
//         } else{
//             res.status(404).json({
//                 status: false,
//                 message: "Post not Found"
//             })
//         }
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({
//              status: false,
//              message: "An error occured",
//              error: error
//          })
//     }
// }

exports.getHotelByTitle = async(req, res, next) => {
    const {title}= req.body;
    try {
        var hotel = await Product.findAll({where: {
            title: title,
        }, include:[
            // {
            //     model: Amenity,
            //     attributes: {
            //         exclude: ["createdAt", "updatedAt"]
            //     }
            // },
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }, 
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Review,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include:[
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                    }
                ]
            }
        ]})
        
        if(hotel){
            
            res.status(200).json({
                status: true,
                data: hotel})
        } else{
            res.status(404).json({
                status: false,
                message: "Post not Found"
            })
        }
    } catch (error) {
         console.error(error)
        next(error);
    }
}

exports.getHotelById = async(req, res, next) => {
    const id= req.params.id;
    try {
        var hotel = await Product.findOne({where: {
            id: id,
        }, include:[
            // {
            //     model: Amenity,
            //     attributes: {
            //         exclude: ["createdAt", "updatedAt"]
            //     }
            // },
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }, 
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Review,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include:[
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                    }
                ]
            }
        ]})
        
        if(hotel){
           
            res.status(200).json({
                status: true,
                data: hotel})
        } else{
            res.status(404).json({
                status: false,
                message: "Post not Found"
            })
        }
    } catch (error) {
         console.error(error)
        next(error);
    }
}

exports.getHotelByIdAdmin = async(req, res, next) => {
    const id= req.params.id;
    try {
        var hotel = await Product.findOne({where: {
            id: id,
        }, include:[
            // {
            //     model: Amenity,
            //     attributes: {
            //         exclude: ["createdAt", "updatedAt"]
            //     }
            // },
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }, 
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Review,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                include:[
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        },
                    }
                ]
            }
        ]})
        
        if(hotel){
    
            console.log("hotels found")
            store.set("hotel", JSON.stringify(hotel));
                  let name = req.user.fullname.split(" ");
                  let email = req.user.email;
                  data = JSON.parse(store.get("hotel"));
                  console.log(data.hotelextras);
                  var img = data['hotelimages']
                  
            // if(img.length){ for(var i=0; i< img.length; i++) {
            //     console.log('image found :',i ,img[i].img_url)
            // }}else{

            // }

                  res.render("dashboard/admin/hotel-view", {
                    user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                    email: email,
                    data: data,
                    img: img
                  });
                  
    } else{
        req.flash("error", "hotel with id not found")
        res.redirect("/dashboard/admin/")
    }
    } catch (error) {
         console.error(error)
        next(error);
    }
}

exports.updateHotel = async(req, res, next) => {
    const {
      title,
      description,
      amenities,
      location,
      rating,
      room,
      price,
      available_room,
      roomId
    } = req.body;
    try{
        
          const hotel = await Product.findOne({
            where: {
              id: req.params.hotelId,
            },
            include: [
              {
                model: Extras,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          });

          let output;
          if (req.body.room && req.body.price && req.body.available_room && req.body.roomId) {
            if (Array.isArray(req.body.room)) {
              output = [];

              for (let i = 0; i < room.length; i++) {
                output.push({
                  hotelId: hotel.id,
                  room: room[i],
                  available_room: available_room[i],
                  price: price[i],
                  roomId: roomId[i],
                });
              }
            } else {
              output = [];

              output.push({
                hotelId: hotel.id,
                room: room,
                available_room: available_room,
                price: price,
                roomId: roomId,
              });
            }
          }

          console.log(output);
          for (let i = 0; i < output.length; i++) {
            let extrasup = await Extras.findOne({
              where: { hotelId: output[i].hotelId, id: output[i].roomId },
            });
            console.log(extrasup);

            if (extrasup !== null) {
              await Extras.update(
                {
                  room: output[i].room,
                  available_room: output[i].available_room,
                  price: output[i].price,
                  roomId: output[i].roomId,
                },
                {
                  where: {
                    id: extrasup.id,
                  },
                }
              );
            } else {
              let extrasout = new Extras({
                hotelId: output[i].hotelId,
                room: output[i].room,
                available_room: output[i].available_room,
                price: output[i].price,
                roomId: output[i].roomId,
              });
              let Eout = await extrasout.save();
              console.log(Eout);
            }
          }
            await Product.update({
                title: title,
                description: description,
                location: location,
                amenities: amenities,
                rating: parseFloat(rating),
            }, { where: {
                id: req.params.hotelId
            }})
    req.flash("success", "Hotel successfully updated");
    res.redirect("/dashboard/admin/hotel-view/" + req.params.hotelId);
        
        
    } catch (error) {
         console.error(error)
        next(error);
    }
}

exports.uploadHotelImage = async(req, res, next) => {
    try{
        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'hotelImages');
              var urls = [];
              var ids = []
              const files = req.files;
              for (const file of files){
                  const { path } = file;
                  const newPath = await uploader(path)
                  urls.push(newPath.url);
                  ids.push(newPath.id)
                  fs.unlinkSync(path)
              }

              var hotelimage = (id, url)=>{
                  var imageoutput = []
                  for(let i=0; i<id.length; i++){
                      imageoutput.push({
                          hotelId: req.params.hotelId,
                          img_id: id[i],
                          img_url: url[i]
                      });
                  }
                  return imageoutput;
              }

             var output = await Image.bulkCreate(hotelimage(ids, urls), {returning: true});
      }
     
            res.status(200).json({
                status: true,
                message: "Image added",
                data: output
            })
          
        
    } catch{
         console.error(error)
        next(error);
    }
}

exports.RemoveHotelImage = async(req, res, next) => {
    try{
       
        await Image.findOne({
            where: {
                id: req.params.imageId
            }
        }).then(async(image)=>{
            if(image){
                await cloudinary.cloudinary.uploader.destroy(image.img_id);
                await Image.destroy({
                    where:{
                        id: image.id
                    }
                });

                res.status(200).json({
                    status: true,
                    message: "Image Removed",
                })
            }else{
                res.status(404).json({
                    status: false,
                    message: "Image Not Found",
                })
            }
        })
     
    } catch{
         console.error(error)
        next(error);
    }
}

exports.deleteHotel = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Product.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: Extras,

                },
                {
                    model: Image,

                },
                {
                    model: HotelBooking
                }
            ]
        }).then(async (hotel) => {
            if (hotel) {
                console.log(hotel)

                      if (hotel.hotelbookings?.length) {
                        await HotelBooking.findAll({
                          where: {
                            hotelId: hotel.id,
                          },
                        }).then(async (hotelbookings) => {
                          if (hotelbookings?.length) {
                            for (var i = 0; i < hotelbookings.length; i++) {
                              await HotelBooking.destroy({
                                where: {
                                  id: hotelbookings[i].id,
                                },
                              });
                            }
                          }
                        });
                      }
                if (hotel.hotelextras?.length) {
                    await Extras.findAll({
                        where: {
                            hotelId: hotel.id
                        }
                    }).then(async (extras) => {
                        if (extras?.length) {
                            for (var i = 0; i < extras.length; i++) {
                                await Extras.destroy({
                                    where: {
                                        id: extras[i].id
                                    }
                                })
                            }
                        }
                    })
                }

                if (hotel.hotelimages?.length) {
                    await Image.findAll({
                        where: {
                            hotelId: hotel.id
                        }
                    }).then(async (image) => {
                        if (image?.length) {
                            for (var i = 0; i < image.length; i++) {
                                await Image.destroy({
                                    where: {
                                        id: image[i].id
                                    }
                                })
                            }
                        }
                    })
                }

                await Product.destroy({
                    where: {
                        id: hotel.id
                    }
                })
                console.log("success")
                res.redirect("/dashboard/admin/get-hotel-posts")
            } else {
                req.flash("error", "hotel not found")
                console.log("error")
                res.redirect("/dashboard/admin/get-hotel-posts")
            }
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
}

