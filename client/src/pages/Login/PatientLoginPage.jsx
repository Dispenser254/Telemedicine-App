import { Button, Label, Spinner, TextInput } from "flowbite-react";
import FooterPage from "../../components/FooterPage";
import NavbarPage from "../../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import { useState } from "react";
import patientIcon from "/images/patientIcon.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/reducers/authenticationSlice";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";

const PatientLoginPage = () => {
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector(
    (state) => state.authentication
  );
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ role: "patient" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fillout all the fields.");
      return dispatch(signInFailure("Please fillout all the fields."));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/mediclinic/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(errorMessage));
        toast.error(data.message);
      }
      dispatch(signInSuccess(data));
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };
  return (
    <>
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div
        className="min-h-screen flex items-center opacity-90 justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <NavbarPage />
        <div className="md:mx-auto mx-4 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
          <div className="flex items-center gap-2">
            <img
              src={patientIcon}
              alt="Patient"
              className="w-20 h-20 mb-4 rounded-full"
            />
            <h2 className="text-2xl font-bold mb-4 uppercase">
              Patient <span className="text-teal-400">Login</span>
            </h2>
          </div>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="mb-2">
              <Label>Username</Label>
              <TextInput
                type="text"
                id="username"
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div className="mb-2">
              <Label>Password</Label>
              <TextInput
                type="password"
                id="password"
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <Button
              type="submit"
              className="hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">New Patient?</p>
            <Link
              to={"/signup"}
              className="font-semibold text-blue-500 hover:text-blue-600"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  );
};

export default PatientLoginPage;
