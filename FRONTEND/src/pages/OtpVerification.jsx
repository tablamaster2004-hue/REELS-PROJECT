import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/theme.css'
import '../styles/auth.css'

export default function OtpVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const [otp, setOtp] = useState('')
    const [timer, setTimer] = useState(120) // 2 minutes in seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const userType = location.state?.userType || 'user'
    const email = location.state?.email || ''

    // Timer countdown effect
    useEffect(() => {
        let interval
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else {
            setIsResendDisabled(false)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const endpoint =
                userType === "user"
                    ? "http://localhost:3000/api/auth/user/verify_email"
                    : "http://localhost:3000/api/auth/foodPartner/verify_email"

            const response = await axios.post(endpoint, {
                otp,
                email
            })

            console.log("Verification successful:", response.data)

            if (userType === "food-partner") {

                const accessToken = response.data.accessToken;
                const partnerId = response.data.foodPartner._id;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("partnerId", partnerId);

                navigate(`/food-partner/${partnerId}`);
            }
            else {
                navigate("/");
            }
        } catch (error) {
            console.error(
                "Verification failed:",
                error.response?.data || error.message
            )
        }
    }

    const handleResendOtp = async (e) => {
        e.preventDefault()

        try {
            const endpoint = userType === 'user'
                ? 'http://localhost:3000/api/auth/user/resend_otp'
                : 'http://localhost:3000/api/auth/foodPartner/resend_otp'

            const response = await axios.post(endpoint, { email })
            console.log("OTP resent successfully:", response.data)

            setTimer(30) // Reset timer to 30sec
            setIsResendDisabled(true)
        } catch (error) {
            console.error("Error resending OTP:", error.response?.data || error.message)
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1 className="auth-title">Verify OTP</h1>
                    <p className="auth-subtitle">Enter the OTP sent to {email}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">One-Time Password</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Verify OTP
                    </button>
                </form>

                <div className="form-footer">
                    <p>
                        Didn't receive OTP?{' '}
                        {isResendDisabled ? (
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Resend in {formatTime(timer)}
                            </span>
                        ) : (
                            <Link to="#" onClick={handleResendOtp}>
                                Resend OTP
                            </Link>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}
