import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/theme.css'
import '../styles/auth.css'
import axios from 'axios'

export default function UserRegister() {
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const fullName = e.target.fullname.value
    const email = e.target.email.value
    const password = e.target.password.value
    const termsAccepted = e.target.terms.checked

    const response = await axios.post("https://reels-backend-rxue.onrender.com/api/auth/user/register",{
        username:fullName,
        email,
        password
    },{
        withCredentials:true
    })
    .then((response) => {
      console.log("Registration successful:", response.data)
      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { userType: 'user', email } })
    })
    .catch((error) => {
      console.error("Registration error:", error)
    })


  }  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Register as User</h1>
          <p className="auth-subtitle">Join us and start exploring</p>
        </div>

        <div className="role-selector">
          <Link to="/user/register" className="role-tab active">
            Register as User
          </Link>
          <Link to="/food-partner/register" className="role-tab">
            Register as Partner
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              id="terms"
              type="checkbox"
              required
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <Link to="/user/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
