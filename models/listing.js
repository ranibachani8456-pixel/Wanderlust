const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
    },

    price:Number,
    location:String,
    country:String,
    //listing and review is one to many relations
    reviews:[
        {
            //Means each item in the array is a MongoDB ObjectId.
            type:Schema.Types.ObjectId,
            //"These ObjectIds belong to documents in the Review collection/model."
            ref:"Review",
        }
    ]
});

const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;