import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://employee-api-sable.vercel.app/api/auth/signup', {
        name,
        email,
        password
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Server Error');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-orange-200 shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Register</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-orange-800">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg bg-orange-50"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-orange-800">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-orange-50"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-orange-800">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg bg-orange-50"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-orange-700">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;