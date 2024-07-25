
import React, { useState } from 'react';
import './login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="wrapper">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="change_password">
        <p>
          <a href="#">Forgot password?</a>
        </p>
      </div>
      <div className="exit_link">
        <p>
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
