const express = require('express');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

const serviceAccount = require('./crud-app-backend-firebase-adminsdk-2ix4q-4b4fc818cf.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const db = firebaseAdmin.firestore();
const todosCollection = db.collection('todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/todos', async (req, res) => {
  try {
    const snapshot = await todosCollection.get();
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const newTodo = { text, completed };
    const docRef = await todosCollection.add(newTodo);
    const todo = { id: docRef.id, ...newTodo };
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todoRef = todosCollection.doc(id);
    await todoRef.update({ text, completed });
    res.json({ id, text, completed });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await todosCollection.doc(id).delete();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
