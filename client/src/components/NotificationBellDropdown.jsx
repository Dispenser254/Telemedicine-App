import { Dropdown, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiBell } from "react-icons/hi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const NotificationBellDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useSelector((state) => state.authentication);
  const userID = currentUser._id;

  const fetchNotifications = async (userID) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/getNotifications/${userID}?limit=5`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch notifications data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchNotifications(userID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleShowAll = () => {
    // navigate("/notifications"); // Adjust the path as necessary
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Notifications</span>
          <HiBell className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
        </span>
      }
    >
      <div className="max-w-[24rem]">
        <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          Notifications
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {loading && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {notification.message}
            </div>
          ))}
        </div>
        <button
          onClick={handleShowAll}
          className="block w-full py-2 text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Show All Notifications
        </button>
      </div>
    </Dropdown>
  );
};

export default NotificationBellDropdown;
