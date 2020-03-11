const express = require('express');
const router = express.Router();
const Book = require('../../models/Books');

//Get The Books List
router.get('/',(req,res,next) =>{
    Book.find()
   .select('TITLE')
    .exec()
    .then(books =>{      
        if(books.length>=0){
           res.status(200).json({
               N_Books:books.length,
               Books:books.map(book =>{
                   return{
                    Title:book.TITLE,                   
                    MoreInfos:'http://localhost:8080/books/'+book._id
                       
                   }
               })
           }); 
        }else{
            res.status(404).json({
            message:'No Book found'
        })}
    })
    .catch(err =>{
        console.log(err);
    });

});

//Get A Book With a specified ID
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    Book.findById(id)
    .select('TITLE AUTHOR EDITOR DESCRIPTION PRICE')
    .exec()
    .then(book => {      
        if(book){
        res.status(200).json(book);
        }else{
            res.status(404).json({
                message:'No Book found With that ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
        });
 });

 //Add a New Book 
 router.post('/',(req,res,next) => {    
     
    const {TITLE,AUTHOR,EDITOR,DESCRIPTION,PRICE}=req.body;  
    newBook= new Book ({    
        TITLE,AUTHOR,EDITOR,DESCRIPTION,PRICE
    });
    newBook.save()
    .then(book => {
        res.status(200).json(book);
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

//Update a Book
router.put('/:id',(req,res,next) =>{
    //Grab the id of the Book
         let id=req.params.id;
     //Find a Book by id from DB
      Book.findById(id)
      .then(book => {
        book.TITLE = req.body.TITLE;
        book.AUTHOR = req.body.AUTHOR;
        book.EDITOR = req.body.EDITOR;
        book.DESCRIPTION = req.body.DESCRIPTION;
        book.PRICE = req.body.PRICE;
              
        book.save()
         .then(book => {
            res.send([{
                  message: 'Book updated successefully',
                  status:'Success',
                  BookUpdated:book
                 }])
         })
         .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
 
 });


//Delete a book
     router.delete('/:id',(req,res,next) => {
        let id=req.params.id;

    Book.findById(id)
     .then(book => {       
        book.delete()
        .then(book => {
            res.send([{
                message: 'Book deleted successefully', 
                status:'Success',
                BookDelted:book}])
        })
        .catch(err => console.log(err))
     })
     .catch(err => console.log(err))
    });
 module.exports=router;