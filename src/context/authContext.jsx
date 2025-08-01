import React, { useState, useContext, useEffect, createContext } from 'react'
import axios from 'axios'

const userContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get('https://employee-api-sable.vercel.app/api/auth/verify', {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })

          if (response.data.success) {
            setUser(response.data.user)
          } else {
            setUser(null)
          }
        } else {
          // No token, set user to null
          setUser(null)
        }
      } catch (error) {
        console.error("User verification error:", error.response?.data || error.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyUser()
  }, [])

  const login = (user) => {
    setUser(user)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)
export default AuthProvider