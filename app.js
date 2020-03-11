const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
//const cors = require('cors');
//const path = require('path');

const app = express();

const db = require('./MyDataBase/db').database;

//DataBase Connection

mongoose.connect(db,{
    useNewUrlParser:true
})
    .then(()=>{
        console.log('Database Connected Sucessfully');
    })
    .catch((err) =>{
        console.log('Unable to connect with the Database',err)   
    });

//Defining The Port
const port = process.env.PORT || 8080;

//Initialize cors Middleware for All Req
//app.use(cors());

//Intialize BodyParser Middleware
app.use(BodyParser.json());
 
//Import Routes
const UsersRoutes=require('./Router/apis/users');  
const BooksRoutes=require('./Router/apis/books');  
const AuthRoutes=require('./Router/apis/auth');  

//Handle requests
app.use('/users',UsersRoutes);
app.use('/books',BooksRoutes);
app.use('/auth',AuthRoutes);

app.listen(port,()=>{
    console.log('server Started on Port ',port)
});

app.use((req,res,next)=>{
    const error= new Error('Not found');
     error.status=404;
     next(error);  
    });
app.use((error,req,res,next)=>{
         res.status(error.status || 500);
         res.json({
             error:{
                 message:error.message
             }
         });
});