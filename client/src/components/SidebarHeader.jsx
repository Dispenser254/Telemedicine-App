import { Sidebar, TextInput } from "flowbite-react";
import { HiChartPie, HiSearch } from "react-icons/hi";
import { FaUserDoctor, FaUserInjured, FaVideo } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdNotifications, MdPayments } from "react-icons/md";
import classNames from "classnames";
import { useSidebarContext } from "../context/SidebarContext";
import SmallScreen from "../helpers/SmallScreen";
import { useEffect, useState } from "react";

export function SidebarHeader() {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

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
                <Sidebar.Item
                  href="/admin-dashboard"
                  icon={HiChartPie}
                  className={
                    "/admin-dashboard" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item
                  href="/doctors-list"
                  icon={FaUserDoctor}
                  className={
                    "/doctors-list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Doctors
                </Sidebar.Item>
                <Sidebar.Item
                  href="/patients-list"
                  icon={FaUserInjured}
                  className={
                    "/patients-list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Patients
                </Sidebar.Item>
                <Sidebar.Item
                  href="/payments-list"
                  icon={MdPayments}
                  className={
                    "/payments-list" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Payments
                </Sidebar.Item>
                <Sidebar.Item
                  href="/video-consultation"
                  icon={FaVideo}
                  className={
                    "/video-consultation" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Video Consultation
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="" icon={MdNotifications}>
                  Notification
                </Sidebar.Item>
                <Sidebar.Item href="" icon={CgProfile}>
                  Profile
                </Sidebar.Item>
                <Sidebar.Item href="" icon={MdLogout}>
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
