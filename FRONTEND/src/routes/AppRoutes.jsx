import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserLogin from '../pages/UserLogin'
import UserRegister from '../pages/UserRegister'
import PartnerLogin from '../pages/PartnerLogin'
import PartnerRegister from '../pages/PartnerRegister'
import OtpVerification from '../pages/OtpVerification'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Home from '../pages/general/Home'
import CreateFood from '../pages/FoodPartner/CreateFood'
import Profile from "../pages/FoodPartner/Profile";
import Saved from '../pages/general/Saved'


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<PartnerRegister />} />
                <Route path="/food-partner/login" element={<PartnerLogin />} />
                <Route path="/verify-otp" element={<OtpVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Home />} />
                <Route path="/create-food" element={<CreateFood />} />
                <Route path="/food-partner/:profile" element={<Profile />} />
                <Route path="/saved" element={<Saved />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes