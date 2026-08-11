const Joi=require("joi");

//listing schema ke andar listing object hogi and vo required hogi

const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image: Joi.object({
            url: Joi.string().required()
        }).required(),
        //taki price negative na ho isliye min value set kar di hai
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required()
    }).required()
})

module.exports={listingSchema}

//server side validation - taki hopsctoch validation ke liye humne joi ka use kiya hai aur schema.js file me schema define kiya hai aur usko app.js me import karke use kiya hai
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})  