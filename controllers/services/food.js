const Product = require('../../model/food');
const Extras = require('../../model/foodextras');
const Package = require("../../model/foodpackaging")
const Image = require('../../model/foodimage')
const cloudinary = require('../../util/cloudinary');
const User = require('../../model/user');
const fs = require('fs');



exports.createFoodService = async(req, res, next) => {
    const { title, description, price } = req.body;
    try {

        var food = new Product({
            title,
            description,
            price: price,
        })
        var  foodout = await food.save();

        if(req.files || req.file){
              const uploader = async (path) => await cloudinary.uploads(path, 'foodImages');
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

                var foodimage = (id, url)=>{
                    var imageoutput = []
                    for(let i=0; i<id.length; i++){
                        imageoutput.push({
                            foodId: foodout.id,
                            img_id: id[i],
                            img_url: url[i]
                        });
                    }
                    return imageoutput;
                }

                await Image.bulkCreate(foodimage(ids, urls), {returning: true});
        }
       


        if(req.body.top && req.body.topPrice){
            if(Array.isArray(req.body.top)){
                var top_price = (top, price)=>{
                    var output = []
                    for(let i = 0; i<top.length; i++){
                        output.push({
                            foodId: foodout.id,
                            topping: top[i],
                            price: price[i]
                        }); 
                    };
                    return output;
                }
            }else{
                top_price = (top, price)=>{
                    var output = []
                    output.push({
                        foodId: foodout.id,
                        topping: top,
                        price: price
                    }); 
                
                    return output;
                }
            }
                
                //console.log(top_price(req.body.top, req.body.topPrice));
                var toppings = await Extras.bulkCreate(top_price(req.body.top, req.body.topPrice), {returning: true})
        }

        if(req.body.packageName && req.body.packagePrice){
            if(Array.isArray(req.body.packageName)){
                var package_price = (package, price)=>{
                    var output = []
                    for(let i = 0; i<package.length; i++){
                        output.push({
                            foodId: foodout.id,
                            name: package[i],
                            price: price[i]
                        }); 
                    };
                    return output;
                }
            }else{
                package_price = (package, price)=>{
                    var output = []
                    output.push({
                        foodId: foodout.id,
                        name: package,
                        price: price
                    }); 
                
                    return output;
                }
            }
                
                //console.log(top_price(req.body.top, req.body.topPrice));
                var packaging = await Package.bulkCreate(package_price(req.body.packageName, req.body.packagePrice), {returning: true})
        }

        var out = await Product.findOne({
            where:{
                id: foodout.id
            }, include:[
                {
                    model: Extras,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: Package,
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
            ]
        })

        res.status(201).json({
            status: true,
            data: out
        });
       
        
    } catch (error) {
        console.error(error)
        next(error);
    }
};



exports.getFoodServices = async(req, res, next) => {
    try {
        const length = req.query.length;

        var food = await Product.findAll({
            include:[
                {
                    model: Extras,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: Package,
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
            ],
        order: [
            ['createdAt', 'ASC']
        ]
    
    });

        
        if(food){

            if(food.length <= length || length === "" || !length){
               
                res.status(200).json({
                    status: true,
                    data: food
                });
            }else{
                
                let begin = length - 10;
                let end = length + 1
                var sliced = food.slice(begin, end)
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


exports.getFoodByTitle = async(req, res, next) => {
    const {title} = req.body;
    try {
        var food = await Product.findOne({where: {
            title: title
            }, include:[
                {
                    model: Extras,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: Package,
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
            ]}
        )
        if(food){
            res.status(200).json({
                status: true,
                data: food 
            })
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

exports.getFoodById = async(req, res, next) => {
    const id= req.params.id;
    try {
        var food = await Product.findOne({where: {
            id: id,
        }, include:[
            {
                model: Extras,
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            {
                model: Package,
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
        ]})
       
        if(food){
            res.status(200).json({
                status: true,
                data: food
            })
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

exports.updateFood = async(req, res, next) => {
    const {title, description, price} = req.body;
    try{
            await Product.update({
                title: title,
                description: description,
                price: price,
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

exports.uploadFoodImage = async(req, res, next) => {
    try{
        if(req.files || req.file){
            const uploader = async (path) => await cloudinary.uploads(path, 'foodImages');
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

              var foodimage = (id, url)=>{
                  var imageoutput = []
                  for(let i=0; i<id.length; i++){
                      imageoutput.push({
                          foodId: req.params.foodId,
                          img_id: id[i],
                          img_url: url[i]
                      });
                  }
                  return imageoutput;
              }

             var output = await Image.bulkCreate(foodimage(ids, urls), {returning: true});
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

exports.RemoveFoodImage = async(req, res, next) => {
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