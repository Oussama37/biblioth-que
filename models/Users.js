const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    FirstName:{type:String,required:true},
    LastName:{type:String,required:true},
    Email:{type:String,required:true,unique:true,
    match:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    Password:{type:String,required:true}
});
const  Users = module.exports=mongoose.model('Users',UserSchema);