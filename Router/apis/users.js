const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

//Get The Users List
router.get('/',(req,res,next) =>{
    User.find()
   .select('FirstName LastName Email')
    .exec()
    .then(users =>{      
        if(users.length>=0){
           res.status(200).json({
               Users:users.map(user =>{
                   return{
                    FirstName:user.FirstName,
                   LastName:user.LastName,                   
                   Email:user.Email,
                   }
               })
           }); 
        }else{
            res.status(404).json({
            message:'No user found'
        })}
    })
    .catch(err => res.status(500).json(err));

});

//Get An User With a specified ID
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    User.findById(id)
    .select('FirstName LastName Email Password')
    .exec()
    .then(user => {      
        if(user){
        res.status(200).json(user);
        }else{
            res.status(404).json({
                message:'No User found With that ID'
            });
        }
    })
    .catch(err => res.status(500).json(err));

 });
  //Create a New User (registe)
router.post('/',(req,res,next) => {
    User.find({Email:req.body.Email })
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message:'Mail Exists'
            });
        }else{
            bcrypt.hash(req.body.Password, 10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const NewUser = new User({
                        FirstName : req.body.FirstName,
                        LastName : req.body.LastName,
                        Email : req.body.Email,
                        Password : hash
                    });
                    NewUser.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message:'User Created'
                        });
                    })
                    .catch(err => res.status(500).json(err))
                }
            });
        }
    })
     
    
});

//Login
router.post('/login',(req,res,next)=>{
    User.find({Email:req.body.Email })
    .exec()
    .then(user => {
        if(user.length < 1 ){
            return res.status(401).json({
                message:'Authentication Failed '
            });
        }
        bcrypt.compare(req.body.Password,user[0].Password,(err,result)=>{
             if(err){
                return res.status(401).json({
                    message:'Authentication Failed '
             });
            }
            if(result){
                const token = jwt.sign({
                  Email:user[0].Email,  
                  Id:user[0]._id,  
                },
                process.env.JWT_KEY,{
                    expiresIn:"1h"
                }
                );
                return res.status(200).json({
                    message:'Authentication Successful',
                    token:token
                })
            }
            res.status(401).json({
                message:'Authentication Failed'
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })    
})
 

//Update an User
router.put('/:id',(req,res,next) =>{
    //Grab the id of the user
         let id=req.params.id;
     //Find a User by id from DB
      User.findById(id)
      .then(user => {
        user.FirstName = req.body.FirstName;
        user.LastName = req.body.LastName;
        user.Email = req.body.Email;
        user.Password = req.body.Password;
              
         user.save()
         .then(user => {
             res.send([{
                  message: 'User updated successefully',
                  status:'Success',
                  userUpdated:user
                 }])
         })
         .catch(err => res.status(500).json(err));

      })
      .catch(err => res.status(500).json(err));

 
 });

//Delete an User
router.delete('/:id',(req,res,next) => {
        let id=req.params.id;

    User.findById(id)
     .then(user => {       
        user.delete()
        .then(user => {
            res.send([{
                message: 'User deleted successefully', 
                status:'Success',
                UserDelted:user}])
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

 module.exports=router;