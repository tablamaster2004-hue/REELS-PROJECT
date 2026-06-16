import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/auth.css'

export default function PartnerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/foodPartner/login',
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      )

      // Save access token and partner ID
      console.log("LOGIN RESPONSE:", response.data);
      console.log("FOOD PARTNER:", response.data.foodPartner);
      console.log("ID:", response.data.foodPartner?._id);

      localStorage.setItem(
        'accessToken',
        response.data.accessToken
      )
      console.log("FULL RESPONSE DATA:", response.data);

      localStorage.setItem(
        "partnerId",
        response.data.foodPartner?._id
      );

      console.log('Login successful:', response.data)

      navigate(`/food-partner/${response.data.foodPartner._id}`)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed'

      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">Sign in to your food partner account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: 'var(--error-color)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Business Email</label>
            <input
              id="email"
              type="email"
              placeholder="business@example.com"
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
            <label htmlFor="remember" className="checkbox-label">
              Remember me
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Don't have a partner account?{' '}
            <Link to="/food-partner/register">Register here</Link>
          </p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
