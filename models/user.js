const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passportLocalMongoose=require('passport-local-mongoose').default;

const UserSchema=new Schema({
    email:{
        type:String,
        required:true
    }

    
});

//we used passport-local-mongoose because it does hashing and salting of passwords and also adds some methods to our schema for authentication purposes.
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);