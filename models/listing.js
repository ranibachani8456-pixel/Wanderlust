const mongoose=require("mongoose");
const Schema=mongoose.Schema;
//requiring review model-
const Review=require("./review.js");

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

//post mongoose middleware to handle cascading delete of reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing)=>
    {
        if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}})
        }
        

});

const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;