import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import PatientLoginPage from "./pages/PatientLoginPage";
import DoctorSignupPage from "./pages/DoctorSignupPage";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import OnlyDoctorPrivateRoute from "./components/OnlyDoctorPrivateRoute";
import OnlyPatientPrivateRoute from "./components/OnlyPatientPrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Patient signup  */}
        <Route path="/signup" element={<RegisterPage />} />
        {/* Doctor signup  */}
        <Route path="/signup" element={<DoctorSignupPage />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<OnlyDoctorPrivateRoute />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Route>
        <Route element={<OnlyPatientPrivateRoute />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
        </Route>

        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/doctor-login" element={<DoctorLoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
