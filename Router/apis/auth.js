const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Auth = require('../../models/Auth');

//Registe
router.post('/singup',(req,res,next) => {
    Auth.find({Email:req.body.Email })
    .exec()
    .then(auth => {
        if(auth.length >= 1){
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
                    const NewAuth = new Auth({
                        FirstName : req.body.FirstName,
                        LastName : req.body.LastName,
                        Email : req.body.Email,
                        Password : hash
                    });
                    NewAuth.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message:'User Created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });
        }
    })
     
    
});

//Login
router.post('/login',(req,res,next)=>{
    Auth.find({Email:req.body.Email })
    .exec()
    .then(auth => {
        if(auth.length < 1 ){
            return res.status(401).json({
                message:'Authentication Failed'
            });
        }
        bcrypt.compare(req.body.Password,auth[0].Password,(err,result)=>{
             if(err){
                return res.status(401).json({
                    message:'Authentication Failed'
             });
            }
            if(result){
                return res.status(200).json({
                    message:'Authentication Successful'
                })
            }
            res.status(401).json({
                message:'Authentication Failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })    
})


module.exports = router ; 