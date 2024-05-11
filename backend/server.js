import express from "express";
import bodyParser from "body-parser";
import cors from  'cors';
import { ObjectId } from 'mongodb';
import { connectionToDb , getDb } from './db.js';

const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let db;

connectionToDb((err) => {
    if(!err){
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
     });
    db = getDb();
    }
})
  

app.get("/api/notes", (req,res) => {
    let notes=[]

    db.collection('notes')
        .find()
        .sort({ _id : 1})   //cursor toArray forEach
        .forEach(note => {
            notes.push(note)
        })
        .then(() => {
            res.status(200).json(notes)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the notes'})
        });
});

app.post("/api/addnote", (req,res)=>{
  const title=req.body.title;
  const content=req.body.content;
  const note={
    title,
    content
  };

  db.collection('notes')
    .insertOne(note)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({ err: 'could not create a new note'});
    })
});

app.delete("/api/deletenote/:id", (req,res)=> {
    
   if(ObjectId.isValid(req.params.id)){
    db.collection('notes')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not delete the note'})
    })
   } else{
        res.status(500).json({error: 'Not a valid note id'})
   }  
});
  
