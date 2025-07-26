import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios"
import { useAuth } from '../context/authContext'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://employee-api-sable.vercel.app/api/auth/login', { email, password })
      if (response.data.success) {
        login(response.data.user)
        localStorage.setItem("token", response.data.token)
        if (response.data.user.role === "admin") {
          navigate('/admin-dashboard')
        } else {
          navigate('/employee-dashboard')
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error)
      } else {
        setError("Server Error")
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/50 rounded-full backdrop-blur-xl border border-white/30"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/50 rounded-full backdrop-blur-xl border border-white/30"></div>

      <motion.h1 
        initial={{ opacity: 0, y: -40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-orange-500 mb-3 drop-shadow-lg"
      >
        WorkNest System
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.3 }}
        className="text-orange-600 text-lg mb-10"
      >
        Simplify Workforce management. Amplify productivity.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, delay: 0.4 }}
        className="backdrop-blur-md bg-white/40 border border-white/50 shadow-2xl rounded-2xl p-8 w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">Login</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-orange-800 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white/50 text-orange-900 placeholder-orange-500 focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-orange-800 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white/50 text-orange-900 placeholder-orange-500 focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-orange-800">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-orange-500 focus:ring-orange-400" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-sm hover:underline">Forgot password?</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 text-white font-semibold rounded-lg shadow-xl hover:from-orange-500 hover:via-yellow-400 hover:to-orange-600 transition"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-6 text-center text-orange-700">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-orange-600 hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>

      {/* Footer Tagline */}
      <p className="absolute bottom-4 text-orange-700 text-sm">© 2025 Employee Management Platform</p>
    </div>
  )
}

export default Login
