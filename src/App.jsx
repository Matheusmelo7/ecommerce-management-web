import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";


import "./App.css";

function App() {
	
	
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/update-profile" element={<UpdateProfilePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/register" element={<RegisterPage />} />				
				<Route path="/profile" element={<UserProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
