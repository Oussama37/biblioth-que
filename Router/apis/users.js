const express = require('express');
const router = express.Router();
const User = require('../../models/Users');

//Get The Users List
router.get('/',(req,res,next) =>{
    User.find()
   .select('FirstName LastName')
    .exec()
    .then(users =>{      
        if(users.length>=0){
           res.status(200).json({
               N_Users:users.length,
               Users:users.map(user =>{
                   return{
                    FirstName:user.FirstName,
                   LastName:user.LastName,                   
                    MoreInfos:'http://localhost:8080/users/'+user._id
                       
                   }
               })
           }); 
        }else{
            res.status(404).json({
            message:'No user found'
        })}
    })
    .catch(err =>{
        console.log(err);
    });

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
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
        });
 });

 //Create a New User (registe)
 router.post('/',(req,res,next) => {   
    
     const {FirstName,LastName,Email,Password}=req.body;  
    newUser= new User ({    
        FirstName,LastName,Email,Password
    });
     newUser.save()
    .then(user => {
        res.status(200).json(user);
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json({error:err});
    });
        
    
});

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
         .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
 
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
        .catch(err => console.log(err))
    })
     .catch(err => console.log(err))
});

 module.exports=router;