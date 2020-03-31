const express = require('express');
const router = express.Router();
const Book = require('../../models/Books');

//Get The Books List
router.get('/',(req,res,next) =>{
    Book.find()  
    .exec()
    .then(books =>{      
        if(books.length>=0){
           res.status(200).json({
               Books:books.map(book =>{
                   return{
                    Id:book._id, 
                    Title:book.TITLE, 
                    AUTHOR:book.AUTHOR, 
                    EDITOR:book.EDITOR, 
                    DESCRIPTION:book.DESCRIPTION, 
                    PRICE:book.PRICE, 
                    Status:book.STATUS,                                        
                   }
               })
           }); 
        }else{
            res.status(404).json({
            message:'No Book found'
        })}
    })
    .catch(err => res.status(500).json(err))

});

//Get A Book With a specified ID
router.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    Book.findById(id)
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
    .catch(err => res.status(500).json(err))
 });

 //Add a New Book 
 router.post('/',(req,res,next) => {    
     
    const {TITLE,AUTHOR,EDITOR,DESCRIPTION,PRICE,STATUS,AVAILABILITY_DATE}=req.body;  
    newBook= new Book ({    
        TITLE,AUTHOR,EDITOR,DESCRIPTION,PRICE,STATUS,AVAILABILITY_DATE
    });
    newBook.save()
    .then(book => {
        res.status(200).json(book);
    })
    .catch(err => res.status(500).json(err))
});

//Update a Book
router.put('/:id',(req,res,next) =>{
    //Grab the id of the Book
         let id=req.params.id;
     //Find a Book by id from DB
      Book.findById(id)
      .then(book => {
          
        book._id = req.body._id;
        book.TITLE = req.body.TITLE;
        book.AUTHOR = req.body.AUTHOR;
        book.EDITOR = req.body.EDITOR;
        book.DESCRIPTION = req.body.DESCRIPTION;
        book.PRICE = req.body.PRICE;
        book.STATUS = req.body.STATUS;
        book.AVAILABILITY_DATE = req.body.AVAILABILITY_DATE;
              
        book.save()
         .then(book => {
            res.send([{
                  message: 'Book updated successefully',
                  status:'Success',
                  BookUpdated:book
                 }])
         })
         .catch(err => res.status(500).json(err))
      })
      .catch(err => res.status(500).json(err))
 
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
        .catch(err => res.status(500).json(err))
     })
     .catch(err => res.status(500).json(err))
    });
 module.exports=router;