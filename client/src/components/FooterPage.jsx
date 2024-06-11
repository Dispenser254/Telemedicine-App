/* eslint-disable react/no-unescaped-entities */
import { Button, Footer, Label, TextInput } from "flowbite-react";
import { MdLocationPin, MdMail, MdOutlineLockClock, MdPhone } from "react-icons/md";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
} from "react-icons/bs";

const FooterPage = () => {
  return (
    <Footer className="relative px-4 sm:px-8 lg:px-16 xl:px-40 pt-16 pb-4 bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full lg:w-2/6 lg:mx-4 lg:pr-8 md:flex md:flex-col md:items-center">
          <h3 className="font-bold text-2xl">MediClinic Center</h3>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <form className="flex items-center mt-6">
            <div className="w-full">
              <Label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">
                Subscribe for our Newsletter
              </Label>
              <div className="flex flex-row md:flex-col gap-4">
                <TextInput
                  type="email"
                  placeholder="Enter your Email Address"
                  className=""
                />
                <Button type="submit" className="">
                  Subscribe
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-1/6 mt-8 lg:mt-0 md:flex md:flex-col md:items-center">
          <h5 className="uppercase tracking-wider font-semibold text-gray-500">
            Treatments
          </h5>
          <ul className="mt-4">
            <li className="mt-2">
              <a href="" className="opacity-75 hover:opacity-100">
                General
              </a>
            </li>
            <li className="mt-2">
              <a href="" className="opacity-75 hover:opacity-100">
                General
              </a>
            </li>
            <li className="mt-2">
              <a href="" className="opacity-75 hover:opacity-100">
                General
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-2/6 mt-8 lg:mt-0 lg:mx-4 lg:pr-8 md:flex md:flex-col md:items-center">
          <h5 className="uppercase tracking-wider font-semibold text-gray-500">
            Contact Details
          </h5>
          <ul className="mt-4">
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center opacity-75 hover:opacity-100"
              >
                <MdLocationPin />
                <span className="ml-3">Embakasi, Nairobi, Kenya</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center opacity-75 hover:opacity-100"
              >
                <MdPhone />
                <span className="ml-3">+254 111 111 111</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center opacity-75 hover:opacity-100"
              >
                <MdMail />
                <span className="ml-3">mediclinic@outlook.com</span>
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="flex items-center opacity-75 hover:opacity-100"
              >
                <MdOutlineLockClock />
                <span className="ml-3">
                  Mon - Fri: 9:00 - 17:00 hrs <br />
                  Closed on Weekends
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-1/6 mt-6 lg:mt-0 lg:mx-4 md:flex md:flex-col md:items-center">
          <h5 className="uppercase tracking-wider font-semibold text-gray-500">
            We're Social
          </h5>
          <ul className="mt-4 flex gap-4 mb-4">
            <li>
              <a href="">
                <BsFacebook />
              </a>
            </li>
            <li>
              <a href="">
                <BsGithub />
              </a>
            </li>
            <li>
              <a href="">
                <BsInstagram />
              </a>
            </li>
            <li>
              <a href="">
                <BsTwitter />
              </a>
            </li>
          </ul>
          <Footer.Copyright
            by="FrodenZ Labs"
            href="#"
            year={new Date().getFullYear()}
          />
        </div>
      </div>
    </Footer>
  );
};

export default FooterPage;
