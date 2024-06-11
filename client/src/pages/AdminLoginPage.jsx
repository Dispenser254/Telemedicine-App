import { Button, Label, Modal, TextInput } from "flowbite-react";
import FooterPage from "../components/FooterPage";
import NavbarPage from "../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import { useState } from "react";
import adminImage from "/images/admin_Login.png";
import { FaExclamation } from "react-icons/fa";

const AdminLoginPage = () => {
  const [showModal, setShowModal] = useState(false);

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
          <div className="flex items-center gap-2">
            <img
              src={adminImage}
              alt="Admin"
              className="w-20 h-20 mb-4 rounded-full"
            />
            <h2 className="text-2xl font-bold mb-4 uppercase">
              Admin <span className="text-teal-400">Login</span>
            </h2>
          </div>

          <form className="w-full flex flex-col gap-2">
            <div className="mb-2">
              <Label>Username</Label>
              <TextInput id="username" placeholder="Username" />
            </div>
            <div className="mb-2">
              <Label>Password</Label>
              <TextInput id="password" placeholder="Password" />
            </div>
            <Button type="submit" className="hover:bg-blue-600">
              Login
            </Button>
          </form>
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

export default AdminLoginPage;
