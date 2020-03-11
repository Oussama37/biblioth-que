const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    FirstName:{type:String,required:true},
    LastName:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    Password:{type:String,required:true}
});
const  Users = module.exports=mongoose.model('Users',UserSchema);