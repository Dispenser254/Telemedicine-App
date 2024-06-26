/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import {
  HiChevronLeft,
  HiChevronRight,
  HiEye,
  HiHome,
  HiOutlineExclamationCircle,
  HiTrash,
} from "react-icons/hi";
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AddAppointmentModal from "../components/AddAppointmentModal";

const AppointmentDetailView = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPatients, setAppointmentsPatients] = useState([]);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/appointment/getAppointments");
      if (!response.ok) {
        setErrorMessage("Failed to fetch appointments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setAppointments(data.appointments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/${appointmentIdToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to delete appointment");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      // Filter out the deleted doctor from the local state
      setAppointments(
        appointments.filter(
          (appointment) => appointment._id !== appointmentIdToDelete
        )
      );
      // Fetch the updated list of doctor after deletion
      fetchAppointments();
      setLoading(false);
      toast.success("Appointment deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchAppointmentsByPatientsID = async (patientId) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/patient/${patientId}`
      );

      if (!response.ok) {
        setErrorMessage("Failed to fetch patient appointments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setAppointmentsPatients(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchAppointments();
    } else if (currentUser?.role === "patient") {
      fetchAppointmentsByPatientsID(currentUser.patient_id);
    }
  }, [currentUser]);

  return (
    <NavbarSidebar isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Link to={"/appointment-list"}>
                <Breadcrumb.Item>Appointment</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Appointments
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
                  />
                </div>
              </form>
            </div>
            {currentUser?.role === "patient" && (
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3 bg-green-200 hover:bg-green-300 cursor-pointer rounded-lg">
                <AddAppointmentModal onAppointmentAdded={fetchAppointments} />
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}

      {currentUser?.role === "admin" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Appointment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Time</Table.HeadCell>
                    <Table.HeadCell>Department Name</Table.HeadCell>
                    <Table.HeadCell>Patient Name</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  {appointments.map((appointment) => (
                    <Table.Body
                      key={appointment._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.appointment_time}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.department_id?.department_name || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.patient_id
                            ? `${appointment.patient_id.patient_firstName} ${appointment.patient_id.patient_lastName}`
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-x-4 whitespace-nowrap">
                            <Button color="blue">
                              <div className="flex items-center gap-x-2">
                                <HiEye className="text-lg" />
                                View
                              </div>
                            </Button>
                            <Button
                              color="failure"
                              onClick={() => {
                                setOpen(true);
                                setAppointmentIdToDelete(appointment._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiTrash className="text-lg" />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser?.role === "patient" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Appointment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Time</Table.HeadCell>
                    <Table.HeadCell>Department Name</Table.HeadCell>
                    <Table.HeadCell>Doctor Name</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  {appointmentsPatients.map((appointment) => (
                    <Table.Body
                      key={appointment._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.appointment_time}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.department_id?.department_name || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.doctor_id
                            ? `${appointment.doctor_id.doctor_firstName} ${appointment.doctor_id.doctor_lastName}`
                            : "Not Assigned"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.appointment_type}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment.appointment_status}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-x-4 whitespace-nowrap">
                            <Button
                              color="failure"
                              onClick={() => {
                                setOpen(true);
                                setAppointmentIdToDelete();
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiTrash className="text-lg" />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
      <Pagination />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete appointment</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="failure"
                onClick={() => {
                  setOpen(false);
                  handleDelete();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </NavbarSidebar>
  );
};

const Pagination = () => {
  return (
    <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <a
          href="#"
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </a>
        <a
          href="#"
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </a>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            1-20
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            2290
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};

export default AppointmentDetailView;
