import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/auth.css'

export default function UserLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        'https://reels-backend-rxue.onrender.com/api/auth/user/login',
        {
          email,
          password
        }
      )

      console.log('Login successful:', response.data)

      localStorage.setItem(
        'accessToken',
        response.data.accessToken
      )

      navigate('/')
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: 'var(--error-color)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              id="remember"
              type="checkbox"
            />
            <label
              htmlFor="remember"
              className="checkbox-label"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/user/register">
              Create one
            </Link>
          </p>

          <p style={{ marginTop: '8px' }}>
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}