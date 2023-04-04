const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const note = notes.find( (n) => n.id === +(req.params.id) );
    if (note) {
        res.json(note);
    } else {
        res.status(404);
        res.json({});
    }
})

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter( note => note.id !== +(req.params.id) );
    res.status(204).end();
})

app.post('/api/notes', (req, res) => {
    const receivedNote = req.body;
    console.log(receivedNote);
    if (receivedNote.content && (typeof receivedNote.content) === "string") {
        const id = getId(notes);
        const content = receivedNote.content;
        const important = (typeof receivedNote.important === 'boolean') ? receivedNote.important : false;

        const newNote = { id, content, important };
        notes = notes.concat(newNote);
        res.json(newNote);
    } else {
        res.status(400).json({ "error": "Content missing" });
    }
})

app.put('/api/notes/:id', (req, res) => {
    console.log(req.body);
    if (!req.body.content) {
        res.status(400).json({ error: "content missing" });
    }
    const id = +(req.params.id);
    const updatedNote = { 
        id,
        content: req.body.content,
        important: req.body.important
    };
    
    const note = notes.find( note => note.id===id);
    if (!note) {
        notes = notes.concat(updatedNote);
    } else {
        notes = notes.map( note => note.id===id ? updatedNote : note);
    }
    res.json(updatedNote);
})

app.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
});

//Utility functions
const getId = (notes) => {
    return notes.length ? Math.max( ...notes.map( note => note.id ))+1 : 1;
}