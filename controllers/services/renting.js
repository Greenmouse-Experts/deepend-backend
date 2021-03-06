const Product = require('../../model/renting');
const Image = require('../../model/rentingimage');
const cloudinary = require('../../util/cloudinary');
const User = require('../../model/user');
const fs = require('fs')

exports.createRentService = async(req, res) => {
    const { title, description, location, equipment, per_time, price } = req.body;
    try {
        const rent = new Product({
            title,
            description,
            location,
            per_time,
            equipment,
            price: price
        })
        var rentout = await rent.save();

        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'rentImages');
                        
                    const urls = [];
                    const ids = []
                    const files = req.files;
                    for (const file of files){
                        const { path } = file;
                        const newPath = await uploader(path)
                        urls.push(newPath.url);
                        ids.push(newPath.id)
                        fs.unlinkSync(path)
                    }

                    var rentimage = (id, url)=>{
                        var imageoutput = []
                        for(let i=0; i<id.length; i++){
                            imageoutput.push({
                                rentId: rentout.id,
                                img_id: id[i],
                                img_url: url[i]
                            });
                        }
                        return imageoutput;
                    }
    
                    await Image.bulkCreate(rentimage(ids, urls), {returning: true});
        }
            
        var output = await Product.findOne({ where: {id: rentout.id},
            include:[
                {
                    model: Image,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]});

            res.status(201).json({
                status: true,
                data: output
            });
       
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}


exports.getRentServices = async(req, res) => {
    try {
        const length = req. query.length;
        var rent = await Product.findAll({
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

        
        if(rent){
            
            if(rent.length <= length || length === "" || !length){
                
                res.status(200).json({
                    status: true,
                    data: rent
                });
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = rent.slice(begin, end)
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

// exports.getRentForUser = async(req, res) => {
//     try {
//         var rent = await Product.findAll({ where: {
//             userid: req.user.id,
//             productType: 'rent'
//         }, include:[
//             {
//                 model: User
//             }
//         ]})

        
//         if(rent){
//             for(let i=0; i<rent.length; i++){
//                 rent[i].img_id = JSON.parse(rent[i].img_id);
//                 rent[i].img_url = JSON.parse(rent[i].img_url);
//             }
//             res.status(200).json({
//                 status: true,
//                 data: rent
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

exports.getRentByTitle = async(req, res) => {
    const {title} = req.body;
    try {
        var rent = await Product.findAll({where: {
            title: title
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
        
        if(rent){
            
            res.status(200).json({
                status: true,
                data: rent})
        } else{
            res.status(404).json({
                status: false,
                message: "Post not Found"
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

exports.getRentById = async(req, res) => {
    const id= req.params.id;
    try {
        var rent = await Product.findOne({where: {
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
        
        if(rent){

          
            res.status(200).json({
                status: true,
                data: rent})
        } else{
            res.status(404).json({
                status: false,
                message: "Post not Found"
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

exports.updateRent = async(req, res) => {
    const { title, description, equipment, location, per_time, price } = req.body;
    try{
       
            await Product.update({
                title: title,
                description: description,
                location: location,
                per_time: per_time,
                equipment,
                price: price,
            }, { where: {
                id: req.params.id
            }})
            res.status(200).json({
                status: true,
                message: "Post updated"
            })
        
        
    } catch{
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}

exports.uploadRentImage = async(req, res) => {
    try{
        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'rentImages');
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

              var rentimage = (id, url)=>{
                  var imageoutput = []
                  for(let i=0; i<id.length; i++){
                      imageoutput.push({
                          rentId: req.params.rentId,
                          img_id: id[i],
                          img_url: url[i]
                      });
                  }
                  return imageoutput;
              }

             var output = await Image.bulkCreate(rentimage(ids, urls), {returning: true});
      }
     
            res.status(200).json({
                status: true,
                message: "Image added",
                data: output
            })
          
        
    } catch{
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}

exports.RemoveRentImage = async(req, res) => {
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
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}