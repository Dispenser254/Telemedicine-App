import { Link } from "react-router-dom";
import backgroundImage from "/images/homepage.jpg";
import { Button } from "flowbite-react";
import NavbarPage from "../components/NavbarPage";
import FooterPage from "../components/FooterPage";

const LandingPage = () => {
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
        <div className="md:mx-auto mx-4 p-8 md:p-16 bg-white rounded-lg shadow-lg max-w-xl">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-4">
            Welcome to MediClinic Center
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 mb-8">
            We provide high-quality healthcare services for patients worldwide.
          </p>
          <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 md:space-x-4">
            <Link to={"/login"}>
              <Button className="bg-green-500 font-semibold hover:bg-green-700">
                Sign Up/Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  );
};

export default LandingPage;
