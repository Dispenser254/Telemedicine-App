import { Sidebar, TextInput } from "flowbite-react";
import {
  HiChartPie,
  HiChartSquareBar,
  HiClipboard,
  HiCollection,
  HiInboxIn,
  HiInformationCircle,
  HiLockClosed,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import classNames from "classnames";
import { useSidebarContext } from "../context/SidebarContext";
import SmallScreen from "../helpers/SmallScreen";
import { useEffect, useState } from "react";

export function SidebarHeader() {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const [isCommerceOpen, setCommerceOpen] = useState(true);
  const [isUsersOpen, setUsersOpen] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
    setCommerceOpen(newPage.includes("/e-commerce/"));
    setUsersOpen(newPage.includes("/users/"));
  }, [setCurrentPage, setCommerceOpen, setUsersOpen]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown"
        collapsed={isSidebarOpenOnSmallScreens && !SmallScreen()}
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
                  href="/"
                  icon={HiChartPie}
                  className={
                    "/dashboard" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                  }
                >
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item
                  href="/mailing/inbox"
                  icon={HiInboxIn}
                  label="3"
                  className={
                    "/mailing/inbox" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Inbox
                </Sidebar.Item>
                <Sidebar.Collapse
                  icon={HiShoppingBag}
                  label="E-commerce"
                  open={isCommerceOpen}
                >
                  <Sidebar.Item
                    href="/e-commerce/products"
                    className={
                      "/e-commerce/products" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Products
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/e-commerce/billing"
                    className={
                      "/e-commerce/billing" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Billing
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/e-commerce/invoice"
                    className={
                      "/e-commerce/invoice" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Invoice
                  </Sidebar.Item>
                </Sidebar.Collapse>

                <Sidebar.Collapse
                  icon={HiUsers}
                  label="Users"
                  open={isUsersOpen}
                >
                  <Sidebar.Item
                    href="/users/list"
                    className={
                      "/users/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Users list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/profile"
                    className={
                      "/users/profile" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Profile
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/feed"
                    className={
                      "/users/feed" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Feed
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/settings"
                    className={
                      "/users/settings" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Settings
                  </Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Collapse icon={HiChartSquareBar} label="Pages">
                  <Sidebar.Item href="/pages/pricing">Pricing</Sidebar.Item>
                  <Sidebar.Item href="/pages/maintenance">
                    Maintenance
                  </Sidebar.Item>
                  <Sidebar.Item href="/pages/404">404 not found</Sidebar.Item>
                  <Sidebar.Item href="/pages/500">
                    500 server error
                  </Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Collapse icon={HiLockClosed} label="Authentication">
                  <Sidebar.Item href="/authentication/sign-in">
                    Sign in
                  </Sidebar.Item>
                  <Sidebar.Item href="/authentication/sign-up">
                    Sign up
                  </Sidebar.Item>
                  <Sidebar.Item href="/authentication/forgot-password">
                    Forgot password
                  </Sidebar.Item>
                  <Sidebar.Item href="/authentication/reset-password">
                    Reset password
                  </Sidebar.Item>
                  <Sidebar.Item href="/authentication/profile-lock">
                    Profile lock
                  </Sidebar.Item>
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href=""
                  icon={HiClipboard}
                >
                  Docs
                </Sidebar.Item>
                <Sidebar.Item
                  href=""
                  icon={HiCollection}
                >
                  Components
                </Sidebar.Item>
                <Sidebar.Item
                  href=""
                  icon={HiInformationCircle}
                >
                  Help
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
