import { Button, Label, Modal, TextInput } from "flowbite-react";
import FooterPage from "../components/FooterPage";
import NavbarPage from "../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import { useState } from "react";
import doctorIcon from "/images/doctorIcon.png";
import patientIcon from "/images/patientIcon.png";
import { Link } from "react-router-dom";
import { FaExclamation } from "react-icons/fa";

const LoginPage = () => {
  const [userType, setUserType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          {userType === "" ? (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <div className="flex justify-center mb-4 gap-2">
                <Button
                  onClick={() => handleUserTypeSelect("patient")}
                  className="flex flex-col"
                >
                  <span className="text-xs md:text-lg uppercase">Patient</span>
                  <img
                    src={patientIcon}
                    alt="Patient"
                    className="mr-2 h-12 w-12 md:h-24 md:w-24"
                  />
                </Button>
                <Button
                  onClick={() => handleUserTypeSelect("doctor")}
                  className="flex items-center"
                >
                  <img
                    src={doctorIcon}
                    alt="Doctor"
                    className="mr-2 h-12 w-12 md:h-24 md:w-24"
                  />
                  <span className="text-xs md:text-lg uppercase">Doctor</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="flex flex-col">
                <img
                  src={userType === "doctor" ? doctorIcon : patientIcon}
                  alt="Login"
                  className="w-32 h-32 mb-4 rounded-full"
                />
                <h2 className="text-2xl font-bold mb-4">Login as {userType}</h2>
              </div>
              <div className="flex flex-col pl-4">
                <form className="w-full flex flex-col gap-2">
                  <div>
                    <Label>Username</Label>
                    <TextInput id="username" placeholder="Username" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <TextInput id="password" placeholder="Password" />
                  </div>
                  <Button type="submit" className="hover:bg-blue-600">
                    Login
                  </Button>
                </form>
                {userType === "patient" && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-700">New Patient?</p>
                    <Link
                      to={"/signup"}
                      className="font-semibold text-blue-500 hover:text-blue-600"
                    >
                      Sign up here
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title="Error"
          onClose={handleCloseModal}
          icon={FaExclamation}
        />
      </div>
      <FooterPage />
    </>
  );
};

export default LoginPage;
