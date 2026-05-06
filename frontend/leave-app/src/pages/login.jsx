import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", { email, password });

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);

      if (response.data.role === 'admin') {
        navigate("/admin"); 
      } else {
        navigate("/dashboard");
      }
      
      
      console.log("Logged in successfully:", response.data.name);
      
    } catch (error) {
      setError(error.response?.data?.message || "Invalid Credentials");
    }
  };

  // UI Code starts here (outside handleSubmit)
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-500">Sign in to manage your leaves</p>
        </div>

        {error && <p className="mb-4 font-medium text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="block w-full px-4 py-3 mt-1 text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="block w-full px-4 py-3 mt-1 text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;