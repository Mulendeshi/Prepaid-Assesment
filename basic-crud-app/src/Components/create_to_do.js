import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './create_to_do.css'; // Import your CSS file for styling

const TodoListApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
  fetchTodos('/api/todos');
}, []);

  const apiUrl ='http://localhost:5000/api/todos';

  const fetchTodos = async ()=>{
    try {
        const reponse = await axios.get(apiUrl);
        setTodos(reponse.data);

    } catch (error) {
       console.error('Error fetching todos:', error); 
    }
  }
  const handleInputChange = (e) => {
    setNewTodoText(e.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodoText.trim() !== '') {
      const newTodo = {
        text: newTodoText,
        completed: false
      };

      try {
        const response = await axios.post(apiUrl, newTodo);
        const createdTodo = response.data;
        setTodos([...todos, createdTodo]);
        setNewTodoText('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };


  const handleEditTodoStart = (id, text) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const handleEditingInputChange = (e) => {
    setEditingText(e.target.value);
  };

 const handleEditTodoConfirm = async (id) => {
    try {
      const updatedTodo = {
        text: editingText
      };
      await axios.put(`${apiUrl}/${id}`, updatedTodo);
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText } : todo
      );
      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };


  const handleToggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      };
      await axios.put(`${apiUrl}/${id}`, updatedTodo);
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-list-app">
      <h1>Crud Todo List App</h1>
      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            <div className="todo-text">
              {todo.id === editingTodoId ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={handleEditingInputChange}
                  onBlur={() => handleEditTodoConfirm(todo.id)}
                  autoFocus
                />
              ) : (
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.text}
                </span>
              )}
            </div>
            <div className="todo-actions">
              <button onClick={() => handleEditTodoStart(todo.id, todo.text)}>Edit</button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-todo">
        <input
          type="text"
          placeholder="Add new todo here"
          value={newTodoText}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};


export default TodoListApp;
