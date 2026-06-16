import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/theme.css'
import '../styles/auth.css'
import axios from 'axios'

export default function PartnerRegister() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const businessName = e.target['business-name'].value
    const contactName = e.target['contact-name'].value
    const email = e.target.email.value
    const address = e.target.address.value
    const password = e.target.password.value
    const termsAccepted = e.target.terms.checked

    axios.post("http://localhost:3000/api/auth/foodPartner/register", {
      name:businessName,
      contactName,
      email,
      address,
      password
    })
    .then((response) => {
      console.log("Partner registration successful:", response.data)
      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { userType: 'food-partner', email } })
    })
    .catch((error) => {
      console.error("Partner registration error:", error)
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Register as Food Partner</h1>
          <p className="auth-subtitle">Start growing your food business with us</p>
        </div>

        <div className="role-selector">
          <Link to="/user/register" className="role-tab">
            Register as User
          </Link>
          <Link to="/food-partner/register" className="role-tab active">
            Register as Partner
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="business-name">Business Name</label>
            <input
              id="business-name"
              type="text"
              placeholder="Your Business Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-name">Contact Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Business Email</label>
            <input
              id="email"
              type="email"
              placeholder="business@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <input
              id="address"
              type="text"
              placeholder="Street address"
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
            Register Business
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already registered?{' '}
            <Link to="/food-partner/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
