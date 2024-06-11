import { Link } from "react-router-dom";
import backgroundImage from "/images/homepage.jpg";
import { Button } from "flowbite-react";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen flex items-center opacity-80 justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto p-8 bg-white rounded-lg shadow-lg max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to MediClinic
        </h1>
        <p className="text-lg text-center text-gray-700 mb-8">
          We provide high-quality healthcare services for patients worldwide.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to={"/login"}>
            <Button className="bg-green-500 font-semibold hover:bg-green-700">
              Sign Up/Login
            </Button>
          </Link>
          <Link to={"/adminLogin"}>
            <Button className="bg-purple-500 font-semibold hover:bg-purple-700">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
