import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";


function App() {
  const [notes, setNotes] = useState([]);

  useEffect( ()=>{
    const registerUserdata= async()=>{
     axios.get("http://localhost:7000/api/notes")  
     .then(res=>setNotes(res.data) )
     .catch(error=>console.log(error)); 
    }
    registerUserdata();
  });

  const addNote=async(newNote) =>{
    console.log(newNote);
    await axios.post('http://localhost:7000/api/addnote', newNote, 
    {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {  
    console.log(res);  
    console.log(res.data); 
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    }); 
  })
  }

  function deleteNote(id) {
    axios.delete(`http://localhost:7000/api/deletenote/${id}`,
    {
      headers: {
        Authorization: 'authorizationToken'
      }
      }).then(res => {  
        console.log(res);  
        console.log(res.data);  
        setNotes(prevNotes => {
          return prevNotes.filter((noteItem, index) => {
            return index !== id;
          });
        });
      })  
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
