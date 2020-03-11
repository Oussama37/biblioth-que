const mongoose = require('mongoose');
const BookSchema = mongoose.Schema({
    
    TITLE:{type:String,required:true},
    AUTHOR:{type: String,required:true},
    EDITOR :{type: String,required:true},
    DESCRIPTION :{type: String,required:true},
    CREATION_DATE:{type: Date,default:Date.now},
    PRICE:{type: Number,required:true}

});
const Book = module.exports = mongoose.model('Book',BookSchema);
