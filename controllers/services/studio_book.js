const Product = require('../../model/studio_book');
const Image = require('../../model/studio_book_image');
const cloudinary = require('../../util/cloudinary');
const User = require('../../model/user');
const fs = require('fs')

exports.createStudioService = async(req, res) => {
    const { title, description, location, per_time, price, rating, equipment } = req.body;
    try {
            const studio = new Product({
                    title,
                    description,
                    location,
                    per_time,
                    rating: parseFloat(rating),
                    price: price,
                    equipment,
                })
                var studiout = await studio.save();

            if(req.files || req.file){
                 const uploader = async (path) => await cloudinary.uploads(path, 'studioImages');
            
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

                var studioimage = (id, url)=>{
                    var imageoutput = []
                    for(let i=0; i<id.length; i++){
                        imageoutput.push({
                            studioId: studiout.id,
                            img_id: id[i],
                            img_url: url[i]
                        });
                    }
                    return imageoutput;
                }

                await Image.bulkCreate(studioimage(ids, urls), {returning: true});
            }
           
            var output = await Product.findOne({ where: {id: studiout.id},
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
            })
        
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An error occured",
             error: error
         })
    }
}


exports.getStudioServices = async(req, res) => {
    try {
        const length = req.query.length
        var studio = await Product.findAll({
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

        
        if(studio){
            if(studio.length <= length || length === ""|| !length){
               
                res.status(200).json({
                    status: true,
                    data: studio
                });
            }else{
                let begin = length - 10;
                let end = length + 1
                var sliced = studio.slice(begin, end)
                
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

// exports.getStudioForUser = async(req, res) => {
//     try {
//         const studio = await Product.findAll({ where: {
//             userid: req.user.id,
//             productType: 'studio'
//         }, include:[
//             {
//                 model: User
//             }
//         ]})
//         if(studio){
//             for(let i=0; i<studio.length; i++){
//                 studio[i].img_id = JSON.parse(studio[i].img_id);
//                 studio[i].img_url = JSON.parse(studio[i].img_url);
//             }
//             res.status(200).json({
//                 status: true,
//                 data: studio
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

exports.getStudioByTitle = async(req, res) => {
    const {title} = req.body;
    try {
        const studio = await Product.findAll({where: {
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
        if(studio){
            
            res.status(200).json({
                status: true,
                data: studio})
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

exports.getStudioById = async(req, res) => {
    const id= req.params.id;
    try {
        const studio = await Product.findOne({where: {
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
        if(studio){
            res.status(200).json({
                status: true,
                data: studio})
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

exports.updateStudio = async(req, res) => {
    const { title, description, location, per_time, price, rating, equipment } = req.body;
    try{
            await Product.update({
                title: title,
                description: description,
                location: location,
                per_time: per_time,
                rating: parseFloat(rating),
                price: price,
                equipment: equipment,
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

exports.uploadStudioImage = async(req, res) => {
    try{
        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'studioImages');
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

              var studioimage = (id, url)=>{
                  var imageoutput = []
                  for(let i=0; i<id.length; i++){
                      imageoutput.push({
                          studioId: req.params.studioId,
                          img_id: id[i],
                          img_url: url[i]
                      });
                  }
                  return imageoutput;
              }

             var output = await Image.bulkCreate(studioimage(ids, urls), {returning: true});
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

exports.RemoveStudioImage = async(req, res) => {
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