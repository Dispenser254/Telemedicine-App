import { Sidebar, TextInput } from "flowbite-react";
import { HiChartPie, HiSearch } from "react-icons/hi";
import {
  FaBookMedical,
  FaUserDoctor,
  FaUserInjured,
  FaVideo,
} from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdNotifications, MdPayments } from "react-icons/md";
import classNames from "classnames";
import { useSidebarContext } from "../context/SidebarContext";
import SmallScreen from "../helpers/SmallScreen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/reducers/authenticationSlice";
import { Link } from "react-router-dom";
import { FaHospitalAlt } from "react-icons/fa";

export function SidebarHeader() {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authentication);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const handleSignout = async () => {
    const response = await fetch("/mediclinic/auth/signout", {
      method: "POST",
    });
    if (!response.ok) {
      toast.error("Error signing out.");
    }
    // eslint-disable-next-line no-unused-vars
    const data = response.json();
    toast.success("You have signed out successfully.");
    dispatch(signoutSuccess());
  };
  return (
    <div
      className={classNames("lg:!block border-t z-50", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown"
        collapsed={isSidebarOpenOnSmallScreens && !SmallScreen()}
        className="h-screen"
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <form action="" className="pb-3 md:hidden">
              <TextInput
                icon={HiSearch}
                placeholder="Search"
                size={32}
                required
                type="search"
              />
            </form>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {currentUser?.role === "admin" && (
                  <>
                    <Link to={"/admin-dashboard"} as="div">
                      <Sidebar.Item
                        icon={HiChartPie}
                        className={
                          "/admin-dashboard" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/doctors-list"} as="div">
                      <Sidebar.Item
                        icon={FaUserDoctor}
                        className={
                          "/doctors-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Doctors
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/patients-list"} as="div">
                      <Sidebar.Item
                        icon={FaUserInjured}
                        className={
                          "/patients-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Patients
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/appointment-list"} as="div">
                      <Sidebar.Item
                        icon={FaBookMedical}
                        className={
                          "/appointment-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Appointments
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/payments-list"} as="div">
                      <Sidebar.Item
                        icon={MdPayments}
                        className={
                          "/payments-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Payments
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/video-consultation"} as="div">
                      <Sidebar.Item
                        icon={FaVideo}
                        className={
                          "/video-consultation" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Video Consultation
                      </Sidebar.Item>
                    </Link>
                    <Link to={"/department-list"} as="div">
                      <Sidebar.Item
                        icon={FaHospitalAlt}
                        className={
                          "/department-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Departments
                      </Sidebar.Item>
                    </Link>
                  </>
                )}
                {currentUser?.role === "patient" && (
                  <>
                    <Link to={"/dashboard"}>
                      <Sidebar.Item
                        icon={HiChartPie}
                        className={
                          "/dashboard" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>

                    <Link to={"/video-consultation"}>
                      <Sidebar.Item
                        icon={FaVideo}
                        className={
                          "/video-consultation" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        Video Consultation
                      </Sidebar.Item>
                    </Link>

                    <Link to={"/appointment-list"}>
                      <Sidebar.Item
                        icon={FaBookMedical}
                        className={
                          "/appointment-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        My Appointments
                      </Sidebar.Item>
                    </Link>

                    <Link to={"/payments-list"}>
                      <Sidebar.Item
                        icon={MdPayments}
                        className={
                          "/payments-list" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        My Payments
                      </Sidebar.Item>
                    </Link>
                  </>
                )}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="" icon={MdNotifications}>
                  Notification
                </Sidebar.Item>

                <Link to={"/user-profile"}>
                  <Sidebar.Item
                    icon={CgProfile}
                    className={
                      "/user-profile" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Profile
                  </Sidebar.Item>
                </Link>

                <Sidebar.Item
                  icon={MdLogout}
                  onClick={handleSignout}
                  className="bg-red-100 hover:bg-red-300 font-bold"
                >
                  Sign Out
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default SidebarHeader;
