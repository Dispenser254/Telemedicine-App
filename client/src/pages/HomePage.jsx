import { Button } from "flowbite-react";
import { MdHome, MdVerifiedUser } from "react-icons/md";
import NavbarPage from "../components/NavbarPage";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-100 w-full">
      <NavbarPage />
      {/* Start hero */}
      <section
        className="cover relative bg-blue-400 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 overflow-hidden py-48 flex
      items-center min-h-screen"
      >
        <div className="h-full absolute">
          <img
            src="images/cover-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative h-100 z-10 lg:mt-16 lg:w-3/4 xl:w-2/4">
          <div className="flex items-center md:items-start flex-col gap-4">
            <h1 className="text-white text-center md:text-start text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight">
              Revolutionize Your Healthcare Experience
            </h1>
            <p className="text-blue-100 text-center md:text-start text-xl md:text-2xl leading-snug">
              Find the best doctors and book instant appointments
            </p>
            <Link to={'/landing-page'}>
              <Button
                className="px-8 py-4 text-lg uppercase font-medium shadow-lg hover:opacity-80"
                gradientDuoTone="tealToLime"
              >
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* End hero */}

      {/* Start about */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16 lg:py:32 xl:px-40">
        <div className="flex flex-col lg:flex-row lg:-mx-8 items-center">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              Welcome to MediClinic consultants
            </h2>
            <p className="text-lg font-semibold mt-4">
              Excellence in service providence at the Heart of Nairobi
            </p>
            <p className="mt-2 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Molestiae, quia ullam. Perferendis rerum illo voluptate sunt,
              nulla dolore eos aspernatur quasi quam, dolorem blanditiis? Quod
              accusantium molestiae reiciendis dolorem mollitia?
            </p>
          </div>
          <div className="w-full lg:w-1/2 lg:px-8 mt-12 lg:mt-0">
            <div className="md:flex">
              <div>
                <MdHome className="w-16 h-16 bg-blue-600 rounded-full text-white p-3" />
              </div>
              <div className="mt-4 md:ml-8 md:mt-0">
                <h4 className="text-xl font-bold leading-tight">
                  Everything You Need Under One Roof
                </h4>
                <p className="leading-relaxed mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
                  repellendus iste illum nobis velit earum laudantium, itaque
                  vitae, iusto et commodi tempore quibusdam aperiam odio ducimus
                  enim quia aliquid distinctio.
                </p>
              </div>
            </div>
            <div className="md:flex mt-8">
              <div>
                <MdVerifiedUser className="w-16 h-16 bg-blue-600 rounded-full text-white p-3" />
              </div>
              <div className="md:ml-8 mt-4 md:mt-0">
                <h4 className="text-xl font-bold leading-tight">
                  Our Patient-Focused Approach
                </h4>
                <p className="mt-2 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Porro, facere soluta? Labore, esse minima corrupti nemo
                  excepturi illum optio quas veniam rerum assumenda neque alias
                  iusto fuga dolor mollitia vel!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex md:flex-wrap mt-24 text-center md:-mx-4 md:items-center">
          <div className="md:w-1/2 md:px-4 lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-300 p-8 flex flex-col items-center gap-2">
              <img
                src="images/teeth-whitening.svg"
                alt=""
                className="h-20 mx-auto"
              />
              <h4 className="">Teeth Whitening</h4>
              <p className="mt-1">Let us show you our experience</p>
              <Button href="" outline color="blue">
                Read More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:px-4 mt-4 md:mt-0 lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-300 p-8 flex flex-col items-center gap-2">
              <img
                src="images/oral-surgery.svg"
                alt=""
                className="h-20 mx-auto"
              />
              <h4 className="text-xl font-bold mt-4">Oral Surgery</h4>
              <p className="mt-1">Let us show you our experience</p>
              <Button href="" outline color="blue">
                Read More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:px-4 mt-4 md:mt-8 lg:mt-0 lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-300 p-8 flex flex-col items-center gap-2">
              <img
                src="images/painless-dentistry.svg"
                alt=""
                className="h-20 mx-auto"
              />
              <h4 className="text-xl font-bold mt-4">Painless Dentistry</h4>
              <p className="mt-1">Let us show you our experience</p>
              <Button href="" outline color="blue">
                Read More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:px-4 mt-4 md:mt-8 lg:mt-0 lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-300 p-8 flex flex-col items-center gap-2">
              <img
                src="images/periodontics.svg"
                alt=""
                className="h-20 mx-auto"
              />
              <h4 className="text-xl font-bold mt-4">Periodontics</h4>
              <p className="mt-1">Let us show you our experience</p>
              <Button href="" outline color="blue">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* End about */}

      {/* Start testimonials */}
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 py-16 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:-mx-8">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              Why choose the MediClinic Center?
            </h2>
            <p className="mt-2 leading-relaxed">
              Aenean ut tellus tellus. Suspendisse potenti. Nullam tincidunt
              lacus tellus, sed aliquam est vehicula a. Pellentesque consectetur
              condimentum nulla, eleifend condimentum purus vehicula in. Donec
              convallis sollicitudin facilisis. Integer nisl ligula, accumsan
              non tincidunt ac, imperdiet in enim. Donec efficitur ullamcorper
              metus, eu venenatis nunc. Nam eget neque tempus, mollis sem a,
              faucibus mi.
            </p>
          </div>

          <div className="w-full md:max-w-md md:mx-auto lg:w-1/2 lg:px-8 mt-12 mt:md-0">
            <div className="bg-gray-400 w-full h-72 rounded-lg"></div>

            <p className="italic text-sm mt-2 text-center">
              Modern MediClinic Equipments.
            </p>
          </div>
        </div>
      </section>
      {/* End testimonials */}
    </div>
  );
};

export default HomePage;
