import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/auth.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('user') // 'user' or 'foodPartner'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const endpoint = userType === 'foodPartner' 
        ? 'https://reels-backend-rxue.onrender.com/api/auth/foodPartner/forgot-password'
        : 'https://reels-backend-rxue.onrender.com/api/auth/user/forgot-password'

      const response = await axios.post(endpoint, { email })

      console.log('Password reset email sent:', response.data)
      setSuccess(true)
      setEmail('')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(`/${userType === 'foodPartner' ? 'food-partner' : 'user'}/login`)
      }, 3000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email'
      setError(errorMessage)
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>

        <div className="role-selector" style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className={`role-tab ${userType === 'user' ? 'active' : ''}`}
            onClick={() => setUserType('user')}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            User
          </button>
          <button
            type="button"
            className={`role-tab ${userType === 'foodPartner' ? 'active' : ''}`}
            onClick={() => setUserType('foodPartner')}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Food Partner
          </button>
        </div>

        {success && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: 'var(--success-color)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            Password reset link sent successfully! Redirecting to login...
          </div>
        )}

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder={userType === 'foodPartner' ? 'business@example.com' : 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Remember your password?{' '}
            <Link to={userType === 'foodPartner' ? '/food-partner/login' : '/user/login'}>
              Sign in here
            </Link>
          </p>
          <p style={{ marginTop: '8px' }}>
            Don't have an account?{' '}
            <Link to={userType === 'foodPartner' ? '/food-partner/register' : '/user/register'}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

