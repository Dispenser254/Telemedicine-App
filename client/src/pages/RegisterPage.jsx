/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import NavbarPage from "../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import { FaExclamation } from "react-icons/fa";
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import FooterPage from "../components/FooterPage";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ role: "patient" });
  const [showCredentials, setShowCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleGoBack = () => {
    setShowCredentials(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateForm = () => {};

  const handlePatientDetailsSubmit = () => {
    const errors = validateForm();
    setErrorMessage(errors);
    setShowCredentials(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if (response.ok) {
        navigate("/loginin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
          {!showCredentials ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                Patient's <span className="text-yellow-300">Signup</span>
              </h2>
              <form className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="md:flex md:flex-col">
                  <div className="mb-4">
                    <Label htmlFor="patientName" className="mb-2">
                      Patient Name
                    </Label>
                    <TextInput
                      type="text"
                      id="patientName"
                      name="patientName"
                      placeholder="Patient's Name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="patientAge" className="mb-2">
                      Patient Age
                    </Label>
                    <TextInput
                      type="number"
                      id="patientAge"
                      name="patientAge"
                      placeholder="Patient's Age"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="gender"
                      className="mb-2 block text-gray-700"
                    >
                      Gender
                    </Label>
                    <Select id="gender" name="gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                </div>
                <div className="md:flex md:flex-col">
                  <div className="mb-4">
                    <Label htmlFor="contactNumber" className="mb-2">
                      Contact Number
                    </Label>
                    <TextInput
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="Contact Number"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="address" className="mb-2">
                      Address
                    </Label>
                    <Textarea
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your Address"
                      rows={3}
                      onChange={handleChange}
                    ></Textarea>
                  </div>

                  <Button
                    type="submit"
                    className="bg-blue-400 hover:bg-blue-500"
                    outline
                    onClick={handlePatientDetailsSubmit}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                Patient's <span className="text-yellow-300">Signup</span>
              </h2>
              <form
                className="flex flex-col md:flex-row items-center justify-center gap-4"
                onSubmit={handleSubmit}
              >
                <div className="md:flex md:flex-col">
                  <div className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <TextInput
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="password">Enter Password</Label>
                    <TextInput
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <TextInput
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" />
                          <span className="pl-3">Loading...</span>
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-400 hover:bg-blue-600"
                      outline
                      onClick={handleGoBack}
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
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

export default RegisterPage;
