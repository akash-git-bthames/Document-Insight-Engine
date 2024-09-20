import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem('authToken', token); // Store token in localStorage for session management
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="h-[80vh] w-[35vw] bg-slate-200 rounded-lg shadow-lg shadow-slate-800 m-auto mt-16 flex flex-col  items-center justify-evenly p-10">
      <h1 className="text-3xl font-bold text-[rgb(61,106,255)]">Login</h1>
      <div className="flex flex-col gap-10">
       
      

  <input placeholder="Email" type="email" class="input" value={email} onChange={(e)=>setEmail(e.target.value)}/>

  <input placeholder="Password" type="password" class="input" value={password} onChange={(e)=>setPassword(e.target.value)}/>

      </div>
      <button onClick={handleLogin}>Login</button>
    
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  );
};

export default Login;