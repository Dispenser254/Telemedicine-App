import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Login/RegisterPage";
import DoctorSignupPage from "./pages/Login/DoctorSignupPage";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import OnlyDoctorPrivateRoute from "./components/OnlyDoctorPrivateRoute";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import OnlyPatientPrivateRoute from "./components/OnlyPatientPrivateRoute";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import AdminLoginPage from "./pages/Login/AdminLoginPage";
import DoctorLoginPage from "./pages/Login/DoctorLoginPage";
import PatientLoginPage from "./pages/Login/PatientLoginPage";
import NotFoundPage from "./pages/404";
import PatientDetailView from "./pages/PatientDetailView";
import DoctorDetailView from "./pages/DoctorDetailView";
import PaymentDetailView from "./pages/PaymentDetailView";
import VideoConsultationView from "./pages/VideoConsultationView";
import AppointmentDetailView from "./pages/AppointmentDetailView";

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
          <Route path="/patients-list" element={<PatientDetailView />} />
          <Route path="/doctors-list" element={<DoctorDetailView />} />
          <Route path="/payments-list" element={<PaymentDetailView />} />
          <Route path="/appointment-list" element={<AppointmentDetailView />} />
          <Route
            path="/video-consultation"
            element={<VideoConsultationView />}
          />
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

        {/* Fallback route for handling undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
