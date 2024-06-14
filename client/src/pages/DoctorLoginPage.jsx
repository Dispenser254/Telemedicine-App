import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import FooterPage from "../components/FooterPage";
import NavbarPage from "../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import { useState } from "react";
import doctorIcon from "/images/doctorIcon.png";
import { FaExclamation } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/reducers/authenticationSlice";

const DoctorLoginPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector(
    (state) => state.authentication
  );
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ role: "doctor" });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
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
        dispatch(signInFailure(data.message));
        setShowModal(true);
      }
      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setShowModal(true);
    }
  };
  return (
    <>
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
              src={doctorIcon}
              alt="Doctor"
              className="w-20 h-20 mb-4 rounded-full"
            />
            <h2 className="text-2xl font-bold mb-4 uppercase">
              Doctor <span className="text-teal-400">Login</span>
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
        </div>

        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title="Error"
          message={errorMessage}
          onClose={handleCloseModal}
          icon={FaExclamation}
        />
      </div>
      <FooterPage />
    </>
  );
};

export default DoctorLoginPage;
