// const Cart = require("../model/cart");
const CartItem = require("../model/cartItem");
const User = require("../model/user");
const Food = require("../model/food");
const FoodExtra = require("../model/foodextras");
const Image = require("../model/foodimage")
const Order = require("../model/foodorder");
require('dotenv').config()
const paystack = require('paystack')(process.env.PAYSTACK_SECRET);

exports.AddCart = async(req, res, next)=>{
    var {quantity, foodextrasId} = req.body;
    try {
        if(!quantity){
            quantity = 1
        };

        await Food.findOne({
            where:{
                 id: req.params.foodId
            }
           
        }).then(async(food)=>{
            if(food){
                const order = await Order.findOne({
                    where:{
                        userId: req.user.id,
                        new: true
                    }
                })
                if(order){
                    var orderId = order.id
                }else{
                    var new_order = new Order({
                        userId: req.user.id,
                    })
                    var outer = await new_order.save();
                    orderId = outer.id
                }
            
                var extra = await FoodExtra.findOne({
                    where:{
                        id: foodextrasId
                    }
                    
                })
                if(extra){
                   var price = (parseInt(food.price) + parseInt(extra.price))
                   var extraId = extra.id
                }else{
                    price = parseInt(food.price)
                    extraId = ""
                }
                const Items = new CartItem({
                    userid: req.user.id,
                    foodId: food.id,
                    foodextrasId: extraId,
                    orderId: orderId,
                    qty: quantity,
                    price: price * quantity,
                })

                const Cart = await Items.save();

                const out = await CartItem.findOne(
                    {
                        where:{
                            id: Cart.id
                        }, include:[
                            {
                                model: User,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"]
                                },
                            },
                            {
                                model: Food,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"]
                                },
                                include:[
                                    {
                                        model: Image,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt"]
                                        }
                                    }
                                ]
                                
                            },
                            {
                                model: FoodExtra,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"]
                                }
                            }
                            
                        ]
                    }
                )
                res.status(201).json({
                    status: true,
                    data: out
                })

            }else{
                res.status(404).json({
                    status: false,
                    message: "No Food found"
                })
            }
            
        })
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  })
        next(error);
    }
}

exports.viewCart = async(req, res, next) => {
    try {
        const viewcart = await CartItem.findAll({ where: {
            userId: req.user.id
        }, 
                include: [
                    {
                        model: Food,
                        include:[
                            {
                                model: Image,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"],
                                },
                            }
                        ],
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    {
                        model: FoodExtra,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    }
                ]
            }) 
            res.status(200).json({
                staus: true,
                data: viewcart
            })
            
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  });
         next(error)
    }
};

exports.DeleteCartItem = async(req, res, next)=> {
    try {
        await CartItem.findOne({
            where: {
                id: req.params.cartitemId
            }
        }).then((item) =>{
            if(item){
                await CartItem.destroy({ where: {
                    id: item.id
                }})
                res.status(200).json({
                    status: true,
                    message: "Item Removed Successfully"
                })
            }else{
                res.status(404).json({
                    status: false,
                    message: "Item not found"
                })
            }
        })
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  });
         next(error)
    }
}

exports.addQty = async(req, res, next)=> {
    var {quantity} = req.body;
    // qty = parseInt(qty)
    try {
        await CartItem.findOne({
            where: {
                id: req.params.id
            },
            include:[
                {
                    model: Food,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: FoodExtra,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                }
            ]
        }).then((item) =>{
            if(item){

               if(item.foodextrasId){
                   var price = (parseInt(item.foodId.price) + parseInt(item.foodextrasId.price))
               }else{
                   price = parseInt(item.foodId.price)
               }

                await CartItem.update({
                     qty: quantity,
                     price: price * quantity,
                    
                },
                     { where: {
                    id: item.id
                }})

                const result = await CartItem.findOne({
                    where: {
                        id: item.id
                    }
                })
                res.status(200).json({
                    status: true,
                    message: "Item quantity Increased",
                    data: result
                })
            }else{
                res.status(404).json({
                    status: false,
                    message: "Product not found"
                })
            }
        })
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  });
         next(error)
    }
}

exports.createOrder = async(req, res, next)=>{
    var { address, phone_no } = req.body;
    try {
        await Order.findOne({
            where:{
                userId: req.user.id
            },
            include:[
                {
                    model: CartItem,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                }
            ]
        }).then(async(order)=>{
            if(order){
                var total = 0;
                if(order.fooditems){
                    for(var i =0; i<order.fooditems.length; i++){
                        total = total + order.fooditems[i].price;
                    }
                }
                paystack.transaction.initialize({
                    name: `Food Order #${order.id}`,
                    email: order.userId.email,
                    amount: total * 100,
                    quantity: order.fooditems.length,
                    callback_url: `${process.env.REDIRECT_SITE}/VerifyPay/food`
                }).then(async(transaction)=>{
                    if(transaction){
                        await Order.update({
                            address: address,
                            phone_no: phone_no,
                            sub_total: total,
                            status: "in_progress",
                            Checkout_url: transaction.data.authorization_url,
                            ref_no: transaction.data.reference,
                            access_code: transaction.data.access_code
                        }, {
                            where:{
                                id: order.id
                            }
                        }).catch(err=> console.log(err));
                    }
                }).catch(err=> console.log(err));

                
                const out = await Order.findOne({
                    where: {
                        id: order.id
                    },
                    include:[
                        {
                            model: CartItem,
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        },
                        {
                            model: User,
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        }
                    ]
                })
                res.status(201).json({
                    status: true,
                    message: "Order created",
                    data: out
                })

                
            }else{
                res.json({
                    status: false,
                    message: "No item found in your cart"
                })
            }
        }).catch(err=> console.log(err))

    } catch (error) {
        console.error(error)
         next(error)
    }
}

exports.viewOrder = async(req, res, next)=>{
    try {
        await Order.findOne({
            where: {
                userId: req.user.id
            },
            include:[
                {
                    model: CartItem,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                }
            ]
        }).then((order) =>{
            if(order){
                 res.status(200).json({
                status: true,
                data: order,
            })
            }else{
                res.json({
                    status: false,
                    message: "No order found"
                })
            }
           
        })
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  });
         next(error)
    }
}

exports.updateOrderStatus = async(req, res, next)=>{
    const {status} = req.body;
    try {
        if(status === "delivered" || status === "cancelled"){
            var new_order = false
        }else{
             new_order = true
        }
        await Order.update({
            status: status,
            new: new_order
        }, {
            where: {
                userId: req.user.id
            }
        })

        await Order.findOne({ where: {
            userId: req.user.id
        }
           
        }).then((order) =>{
            res.status(200).json({
                status: true,
                data: order,
            })
        })
    } catch (error) {
        console.error(error)
        // res.status(500).json({
        //      status: false,
        //      message: "An error occured",
        //      error: error
        //  });
         next(error)
    }
}

exports.Checkout
