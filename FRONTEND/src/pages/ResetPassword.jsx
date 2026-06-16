import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/auth.css'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const token = searchParams.get('token')

    const validatePasswords = () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!token) {
            setError('Invalid reset link. Token missing.')
            return
        }

        if (!validatePasswords()) {
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                'https://reels-backend-rxue.onrender.com/api/auth/reset-password',
                {
                    token,
                    newPassword: password
                }
            )

            console.log('Password reset successful:', response.data)
            setSuccess(true)
            setPassword('')
            setConfirmPassword('')

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/user/login')
            }, 2000)
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password'
            setError(errorMessage)
            console.error('Reset password error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-header">
                        <h1 className="auth-title">Invalid Reset Link</h1>
                        <p className="auth-subtitle">The reset link is missing or expired</p>
                    </div>
                    <div style={{
                        padding: '16px',
                        textAlign: 'center'
                    }}>
                        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                            Request a new password reset link
                        </p>
                        <Link to="/forgot-password" className="btn-primary" style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Go to Forgot Password
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">Enter your new password</p>
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
                        Password reset successfully! Redirecting to login...
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
                        <label htmlFor="password">New Password</label>

                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ paddingRight: '12px' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="form-footer">
                    <p>
                        Remember your password?{' '}
                        <Link to="/user/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
