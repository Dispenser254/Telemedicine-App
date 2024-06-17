/* eslint-disable react/no-unescaped-entities */
import { useSidebarContext } from "../context/SidebarContext";
import { HiBell, HiMenuAlt1, HiSearch, HiX } from "react-icons/hi";
import { Dropdown, Label, TextInput, Navbar, Avatar } from "flowbite-react";
import SmallScreen from "../helpers/SmallScreen";

const NavbarHeader = () => {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <Navbar fluid>
      <div className="w-full p-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Toggle Sidebar</span>
                {isOpenOnSmallScreens && SmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img src="" alt="" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Medi<span className="text-green-400">Clinic</span>
              </span>
            </Navbar.Brand>
            <form action="" className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                size={32}
                type="search"
                required
              />
            </form>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <HiBell className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
            </div>
            <div className="hidden lg:block">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <span>
                    <span className="sr-only">User menu</span>
                    <Avatar alt="" img="" rounded size="sm" />
                  </span>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">Neil Sims</span>
                  <span className="block truncate text-sm font-medium">
                    neil.sims@flowbite.com
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarHeader;
