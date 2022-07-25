const Product = require('../../model/vr_gaming');
const Image = require('../../model/vr_gaming_image');
const cloudinary = require('../../util/cloudinary');
const User = require('../../model/user');
const fs = require('fs')
const store = require('store')


exports.createGamingService = async(req, res, next) => {
    const { title, description, genre, per_time, available_game, price, age_rate,} = req.body;
        try {  
            const game = new Product({
                    title,
                    description,
                    genre,
                    price: price,
                    age_rate,
                    available_game,
                    per_time
                })
                var gameout = await game.save();

                if(req.files || req.file){
                        const uploader = async (path) => await cloudinary.uploads(path, 'gameImages');
                    
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
                        
                        var gameimage = (id, url)=>{
                            var imageoutput = []
                            for(let i=0; i<id.length; i++){
                                imageoutput.push({
                                    gameId: gameout.id,
                                    img_id: id[i],
                                    img_url: url[i]
                                });
                            }
                            return imageoutput;
                        }
        
                        await Image.bulkCreate(gameimage(ids, urls), {returning: true});
                }
            
            var output = await Product.findOne({ where: {id: gameout.id},
                    include:[
                    {
                        model: Image,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ]});

                res.redirect("/dashboard/admin/")

        
    } catch (error) {
        console.error(error)
        next(error);
    }
}

exports.getGamingAppServices = async(req, res, next) => {
    try {
        const length = req.query.length
        var game = await Product.findAll({
            order: [
                ['createdAt', 'ASC']
        ],
        include:[
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }
        ]
        });

        if(game){
           
            if(game.length <= length || length === "" || !length){

                res.status(200).json({
                    status: true,
                    data: game
                });
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = game.slice(begin, end)

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
       return res.status(500).json({
            status: false,
            message: "An error occured",
            error: error
        })
    }
}

exports.gameCount = async (rea, res, next)=>{
    try {
        const games = await Product.count()
        if (games){
            store.set("games", games);
            console.log('games found:', games)
           
                next();
           
        } else{
          console.log("no games", games)
          store.set("games", games);
                
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


exports.getGamingServices = async(req, res, next) => {
    try {
        const length = req.query.length
        var game = await Product.findAll({
            order: [
                ['createdAt', 'ASC']
        ],
        include:[
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }
        ]
        });

        if(game){
           
            if(game.length <= length || length === "" || !length){

                console.log("vr-games found")
                store.set("vr-game", JSON.stringify(game));
                      let name = req.user.fullname.split(" ");
                      let email = req.user.email;
                      data = JSON.parse(store.get("vr-game"));
                      console.log(data)
                      res.render("dashboard/admin/vr-games", {
                        user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                        email: email,
                        data
                      });
                      next();
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = game.slice(begin, end)

                console.log("vr-games found")
                store.set("vr-game", JSON.stringify(game));
                      let name = req.user.fullname.split(" ");
                      let email = req.user.email;
                      data = JSON.parse(store.get("vr-game"));
                      console.log(data)
                      res.render("dashboard/admin/vr-games", {
                        user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                        email: email,
                        data
                      });
                      next();
            }
        } else{
            console.log("vr-games found")
            store.set("vr-game", JSON.stringify(game));
                  let name = req.user.fullname.split(" ");
                  let email = req.user.email;
                  data = JSON.parse(store.get("vr-game"));
                  console.log(data)
                  res.render("dashboard/admin/vr-games", {
                    user: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                    email: email,
                    data
                  });
                  next();
        }
    } catch (error) {
        console.error(error)
       return res.status(500).json({
            status: false,
            message: "An error occured",
            error: error
        })
    }
}

// exports.getGamingForUser = async(req, res, next) => {
//     try {
//         var game = await Product.findAll({ where: {
//             userid: req.user.id,
//             productType: 'game'
//         }, include:[
//             {
//                 model: User
//             }
//         ]})
       
//         if(game){
//             for(let i=0; i<game.length; i++){
//                 game[i].img_id = JSON.parse(game[i].img_id);
//                 game[i].img_url = JSON.parse(game[i].img_url);
//             }
//             res.status(200).json({
//                 status: true,
//                 data: game
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

exports.getGamingByTitle = async(req, res, next) => {
    const {title} = req.body;
    try {
        var game = await Product.findAll({where: {
            title: title,
        }, 
        include:[
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }
        ]
    })
       
        if(game){
            res.status(200).json({
                status: true,
                data: game})
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

exports.getGameById = async(req, res, next) => {
    const id= req.params.id;
    try {
        var game = await Product.findOne({where: {
            id: id,
        }, 
        include:[
            {
                model: Image,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            }
        ]
    })
        
        if(game){
            res.status(200).json({
                status: true,
                data: game})
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

exports.updateGaming = async(req, res, next) => {
    const { title, description, available_game, per_time, genre, price, age_rate,} = req.body;
    try{
            await Product.update({
                title: title,
                description: description,
                genre: genre,
                price: price,
                age_rate: age_rate,
                available_game,
                per_time
            }, { where: {
                id: req.params.id,
            }})
            res.status(200).json({
                status: true,
                message: "Post updated"
            })
        
        
    } catch{
        console.error(error)
        next(error);
    }
}

exports.uploadGameImage = async(req, res, next) => {
    try{
        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'gameImages');
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

              var gameimage = (id, url)=>{
                  var imageoutput = []
                  for(let i=0; i<id.length; i++){
                      imageoutput.push({
                          gameId: req.params.gameId,
                          img_id: id[i],
                          img_url: url[i]
                      });
                  }
                  return imageoutput;
              }

             var output = await Image.bulkCreate(gameimage(ids, urls), {returning: true});
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

exports.RemoveGameImage = async(req, res, next) => {
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