/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import {
  HiChevronLeft,
  HiChevronRight,
  HiDocument,
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
  Select,
  Spinner,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AddAppointmentModal from "../components/AddAppointmentModal";
import { FaEdit, FaEye, FaHandHoldingMedical } from "react-icons/fa";

const AppointmentDetailView = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionDoctor, setPrescriptionDoctor] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentsPatients, setAppointmentsPatients] = useState([]);
  const [appointmentsDoctors, setAppointmentsDoctors] = useState([]);
  const [appointmentIdToDelete, setAppointmentIdToDelete] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [openPrescription, setOpenPrescription] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);

  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [patientId, setPatientId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [prescriptionDetails, setPrescriptionDetails] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchAppointments();
    } else if (currentUser?.role === "doctor") {
      fetchAppointmentsByDoctorsID(currentUser.doctor_id);
      fetchPrescriptionsByDoctorID(currentUser.doctor_id);
    } else if (currentUser?.role === "patient") {
      fetchAppointmentsByPatientsID(currentUser.patient_id);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorId") {
      setDoctorId(value);
    } else if (name === "appointmentStatus") {
      setAppointmentStatus(value);
    } else if (name === "prescriptionDate") {
      setPrescriptionDate(value);
    } else if (name === "prescriptionDetails") {
      setPrescriptionDetails(value);
    }
  };

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

  const fetchAppointmentsByID = async (appointmentID) => {
    try {
      setLoadingAppointments(true);
      setErrorMessage(null);

      const response = await fetch(
        `/mediclinic/appointment/getAppointments/${appointmentID}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch selected appointments data.");
        toast.error(errorMessage);
        setLoadingAppointments(false);
      }
      const data = await response.json();
      setAppointmentStatus(data.appointment_status || "N/A");
      setAppointmentType(data.appointment_type || "N/A");
      setAppointmentTime(data.appointment_time || "N/A");
      setAppointmentDate(data.appointment_date || "N/A");
      setDoctorId(data.doctor_id || "N/A");
      setDepartmentId(data.department_id || "N/A");
      setPatientId(data.patient_id || "N/A");
      setLoadingAppointments(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingAppointments(false);
    }
  };

  const fetchDoctorByID = async (departmentID) => {
    try {
      setLoadingDoctors(true);
      const response = await fetch(
        `/mediclinic/doctor/getDoctors/department/${departmentID}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch doctors by department data.");
        toast.error(errorMessage);
        setLoadingDoctors(false);
      }
      const data = await response.json();
      setDoctors(data.doctors);
      setLoadingDoctors(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingDoctors(false);
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
      if (currentUser?.role === "admin") {
        fetchAppointments();
      } else if (currentUser?.role === "patient") {
        fetchAppointmentsByPatientsID(currentUser.patient_id);
      }
      setLoading(false);
      toast.success("Appointment deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchAppointmentsByPatientsID = async (patientId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/patient/${patientId}`
      );

      if (!response.ok) {
        setErrorMessage("Failed to fetch patient appointments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setAppointmentsPatients(data.appointment);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchAppointmentsByDoctorsID = async (doctorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/doctor/${doctorId}`
      );

      if (!response.ok) {
        setErrorMessage(
          "Failed to fetch patient appointments by doctor id data."
        );
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setAppointmentsDoctors(data.appointments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchPrescriptionsByAppointmentID = async (appointmentID) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/prescription/getPrescriptions/appointment/${appointmentID}`
      );

      if (!response.ok) {
        const errorMessage = "Failed to fetch patient prescription data.";
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.length > 0) {
        const prescription = data[0];
        setPrescriptionDetails(prescription.prescription_details);
        setPrescriptionDate(prescription.prescription_date);
      } else {
        setErrorMessage("No prescriptions found for this appointment.");
        toast.error(errorMessage);
      }

      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const fetchPrescriptionsByDoctorID = async (doctorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/prescription/getPrescriptions/doctor/${doctorId}`
      );

      if (!response.ok) {
        setErrorMessage(
          "Failed to fetch patient prescription by doctor id data."
        );
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setPrescriptionDoctor(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        patient_id: patientId,
        doctor_id: doctorId,
        department_id: departmentId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_status: appointmentStatus,
        appointment_type: appointmentType,
      };
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update appointment");
      }
      // eslint-disable-next-line no-unused-vars
      const updatedAppointment = await response.json();
      fetchAppointments();
      toast.success("Appointment updated successfully");
      setAppointmentModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        patient_id: patientId._id,
        doctor_id: doctorId._id,
        appointment_id: appointmentId,
        prescription_date: prescriptionDate,
        prescription_details: prescriptionDetails,
      };
      console.log(updatedData);
      const response = await fetch(
        "/mediclinic/prescription/createPrescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update prescription");
      }
      // eslint-disable-next-line no-unused-vars
      const updatedPrescription = await response.json();
      fetchAppointmentsByDoctorsID(currentUser.doctor_id);
      toast.success("Prescription updated successfully");
      setPrescriptionModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewOrPrescribe = async (appointmentID) => {
    setAppointmentId(appointmentID);
    setPrescriptionModal(true);
    fetchAppointmentsByID(appointmentID);
    await fetchPrescriptionsByAppointmentID(appointmentID);
  };

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
                    <Table.HeadCell>Doctor Name</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
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
                            : "Not Assigned"}
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
                              color={
                                appointment.appointment_status ===
                                "Pending with admin"
                                  ? "blue"
                                  : "success"
                              }
                              onClick={() => {
                                setAppointmentModal(true);
                                setAppointmentId(appointment._id);
                                fetchAppointmentsByID(appointment._id);
                                fetchDoctorByID(appointment.department_id._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                {appointment.appointment_status ===
                                "Pending with admin" ? (
                                  <>
                                    <HiDocument className="text-lg" />
                                    Assign Doc
                                  </>
                                ) : (
                                  <>
                                    <HiEye className="text-lg" />
                                    View
                                  </>
                                )}
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

      {currentUser?.role === "doctor" && (
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
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Prescribe</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  {appointmentsDoctors?.map((appointment) => (
                    <Table.Body
                      key={appointment._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {new Date(
                            appointment?.appointment_date
                          ).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment?.appointment_time}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment?.department_id?.department_name || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment?.patient_id
                            ? `${appointment.patient_id.patient_firstName} ${appointment.patient_id.patient_lastName}`
                            : "Not Assigned"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment?.appointment_type}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {appointment?.appointment_status}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescriptionDoctor ? (
                            <Button
                              color="purple"
                              onClick={() =>
                                handleViewOrPrescribe(appointment._id)
                              }
                            >
                              <div className="flex items-center gap-x-2">
                                <FaEye className="text-lg" />
                                View
                              </div>
                            </Button>
                          ) : (
                            <Button
                              color="success"
                              onClick={() =>
                                handleViewOrPrescribe(appointment._id)
                              }
                            >
                              <div className="flex items-center gap-x-2">
                                <FaHandHoldingMedical className="text-lg" />
                                Prescribe
                              </div>
                            </Button>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-x-4 whitespace-nowrap">
                            {appointment?.appointment_status === "Scheduled" ? (
                              <Button
                                color="blue"
                                onClick={() => {
                                  setAppointmentModal(true);
                                  setAppointmentId(appointment._id);
                                  fetchAppointmentsByID(appointment._id);
                                }}
                              >
                                <div className="flex items-center gap-x-2">
                                  <FaEdit className="text-lg" />
                                  Edit
                                </div>
                              </Button>
                            ) : null}

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
                              color="blue"
                              onClick={() => {
                                setOpenPrescription(true);
                                setAppointmentId(appointment._id);
                                fetchAppointmentsByID(appointment._id);
                                fetchPrescriptionsByAppointmentID(
                                  appointment._id
                                );
                              }}
                            >
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
      <Pagination />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6 text-2xl font-bold mb-4 text-center uppercase">
          Delete <span className="text-yellow-300">Appointment</span>
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

      <Modal
        onClose={() => setOpenPrescription(false)}
        show={openPrescription}
        size="2xl"
        position="center"
      >
        <Modal.Header className="px-6 pb-0 pt-6 text-2xl font-bold mb-4 text-center uppercase">
          Patient <span className="text-yellow-300">Details</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Form View</h2>
            <div className="border border-gray-300 rounded-md p-4">
              <Table className="w-full">
                <Table.Body>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Patient's Name
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {patientId?.patient_firstName || "N/A"}{" "}
                      {patientId?.patient_lastName || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Prescription Date
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {prescriptionDate
                        ? new Date(prescriptionDate).toISOString().split("T")[0]
                        : ""}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Prescription Details
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {prescriptionDetails}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Doctor's Name
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {doctorId?.doctor_firstName || "N/A"}{" "}
                      {doctorId?.doctor_lastName || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Department Name
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {departmentId?.department_name || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Appointment Date
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {appointmentDate
                        ? new Date(appointmentDate).toISOString().split("T")[0]
                        : ""}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Appointment Time
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {appointmentTime || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Appointment Type
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {appointmentType || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="border-b border-gray-300">
                    <Table.Cell className="py-2 font-semibold">
                      Appointment Status
                    </Table.Cell>
                    <Table.Cell className="py-2 whitespace-pre-wrap">
                      {appointmentStatus || "N/A"}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        onClose={() => setAppointmentModal(false)}
        show={appointmentModal}
        size="md"
      >
        <Modal.Header className="px-6 pb-0 pt-6 text-2xl font-bold mb-4 text-center uppercase">
          Assign <span className="text-yellow-300">Doctor</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            {loadingAppointments && (
              <>
                <Spinner size="lg" />
                <span className="pl-3">Loading...</span>
              </>
            )}
            <div className="flex mt-2 gap-2">
              <div className="mb-4">
                <Label htmlFor="appointmentDate" className="mb-2">
                  Appointment Date
                </Label>
                <TextInput
                  disabled
                  type="text"
                  id="appointmentDate"
                  name="appointmentDate"
                  placeholder="Appointment Date"
                  value={
                    appointmentDate
                      ? new Date(appointmentDate)
                          .toLocaleDateString()
                          .split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="appointmentTime" className="mb-2">
                  Appointment Time
                </Label>
                <TextInput
                  disabled
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  placeholder="Appointment Time"
                  value={appointmentTime || "N/A"}
                />
              </div>
            </div>
            <div className="flex mt-2 gap-2">
              <div className="mb-4">
                <Label htmlFor="gender" className="mb-2 block text-gray-700">
                  Select Appointment Type
                </Label>
                <TextInput
                  disabled
                  type="text"
                  id="appointmentType"
                  name="appointmentType"
                  placeholder="Appointment Type"
                  value={appointmentType || "N/A"}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="departmentId" className="mb-2">
                  Department
                </Label>
                <TextInput
                  disabled
                  type="text"
                  id="departmentId"
                  name="departmentId"
                  placeholder="Department"
                  value={departmentId?.department_name || "N/A"}
                />
              </div>
            </div>
            {currentUser.role === "admin" || currentUser.role === "doctor" ? (
              <div className="flex mt-2 gap-2">
                <div className="mb-4">
                  <Label
                    htmlFor="patientFirstName"
                    className="mb-2 block text-gray-700"
                  >
                    Patient First Name
                  </Label>
                  <TextInput
                    disabled
                    type="text"
                    id="patientFirstName"
                    name="patientFirstName"
                    placeholder="Patient First Name"
                    value={patientId?.patient_firstName || "N/A"}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="patientLastName" className="mb-2">
                    Patient Last Name
                  </Label>
                  <TextInput
                    disabled
                    type="text"
                    id="patientLastName"
                    name="patientLastName"
                    placeholder="Patient Last Name"
                    value={patientId?.patient_lastName || "N/A"}
                  />
                </div>
              </div>
            ) : null}

            {currentUser?.role === "admin" &&
            (appointmentStatus === "Pending with admin" ||
              appointmentStatus === "Scheduled") ? (
              <div className="flex mt-2 gap-2">
                <div className="mb-4">
                  <Label htmlFor="appointmentStatus" className="mb-2">
                    Appointment Status
                  </Label>
                  <Select
                    id="appointmentStatus"
                    name="appointmentStatus"
                    onChange={handleChange}
                    required
                    disabled={loadingDoctors}
                  >
                    {loadingDoctors ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      <>
                        <option value={appointmentStatus}>
                          {appointmentStatus}
                        </option>
                        <option value="Scheduled">SCHEDULE</option>
                        <option value="Cancel">CANCEL</option>
                      </>
                    )}
                  </Select>
                </div>
                <div className="mb-4">
                  <Label htmlFor="doctorId" className="mb-2">
                    Doctor
                  </Label>
                  <Select
                    id="doctorId"
                    name="doctorId"
                    onChange={handleChange}
                    required
                    disabled={loadingDoctors}
                  >
                    {loadingDoctors ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      <>
                        <option value="">Select Doctor</option>
                        {doctors?.map((doc) => (
                          <option key={doc?._id} value={doc?._id}>
                            {doc?.doctor_firstName} {doc?.doctor_lastName}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                </div>
              </div>
            ) : currentUser?.role === "patient" ? (
              <div className="flex mt-2 gap-2">
                <div className="mb-4">
                  <Label htmlFor="doctorFirstName" className="mb-2">
                    Doctor First Name
                  </Label>
                  <TextInput
                    disabled
                    type="text"
                    id="doctorFirstName"
                    name="doctorFirstName"
                    placeholder="Doctor First Name"
                    value={doctorId?.doctor_firstName || "N/A"}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="doctorLastName" className="mb-2">
                    Doctor Last Name
                  </Label>
                  <TextInput
                    disabled
                    type="text"
                    id="doctorLastName"
                    name="doctorLastName"
                    placeholder="Doctor Last Name"
                    value={doctorId?.doctor_lastName || "N/A"}
                  />
                </div>
              </div>
            ) : null}

            {currentUser?.role === "doctor" ? (
              <div className="mb-4">
                <Label htmlFor="appointmentStatus" className="mb-2">
                  Appointment Status
                </Label>
                <Select
                  id="appointmentStatus"
                  name="appointmentStatus"
                  onChange={handleChange}
                  required
                  disabled={loadingAppointments}
                >
                  {loadingAppointments ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    <>
                      <option value={appointmentStatus}>
                        {appointmentStatus}
                      </option>
                      <option value="Follow-up">FOLLOW-UP</option>
                      <option value="Completed">COMPLETED</option>
                      <option value="Cancel">CANCEL</option>
                    </>
                  )}
                </Select>
              </div>
            ) : null}

            {currentUser.role === "admin" &&
            appointmentStatus === "Pending with admin" ? (
              <div className="flex items-center gap-x-6">
                <Button
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setAppointmentModal(false);
                    handleSubmit(e);
                  }}
                >
                  Submit
                </Button>
                <Button color="gray" onClick={() => setAppointmentModal(false)}>
                  No, cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-x-6">
                <Button
                  color="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setAppointmentModal(false);
                    handleSubmit(e);
                  }}
                >
                  Submit
                </Button>
                <Button color="gray" onClick={() => setAppointmentModal(false)}>
                  No, cancel
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        onClose={() => setPrescriptionModal(false)}
        show={prescriptionModal}
        size="lg"
      >
        <Modal.Header className="px-6 pb-0 pt-6 text-2xl font-bold mb-4 text-center uppercase">
          Prescribe <span className="text-yellow-300">Medicine</span>
        </Modal.Header>
        <Modal.Body className="px-10 pb-6 pt-2">
          <div className="flex flex-col text-center">
            {loadingAppointments && (
              <>
                <Spinner size="lg" />
                <span className="pl-3">Loading...</span>
              </>
            )}
            <div className="flex mt-2 gap-2">
              <div className="mb-4">
                <Label
                  htmlFor="patientFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Patient First Name
                </Label>
                <TextInput
                  disabled
                  type="text"
                  id="patientFirstName"
                  name="patientFirstName"
                  placeholder="Patient First Name"
                  value={patientId?.patient_firstName || "N/A"}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="patientLastName" className="mb-2">
                  Patient Last Name
                </Label>
                <TextInput
                  disabled
                  type="text"
                  id="patientLastName"
                  name="patientLastName"
                  placeholder="Patient Last Name"
                  value={patientId?.patient_lastName || "N/A"}
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="prescriptionDate" className="mb-2">
                Prescription Date
              </Label>
              <TextInput
                type="date"
                id="prescriptionDate"
                name="prescriptionDate"
                placeholder="Prescription Date"
                value={
                  prescriptionDate
                    ? new Date(prescriptionDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="prescriptionDetails" className="mb-2">
                Prescription Details
              </Label>
              <Textarea
                type="text"
                id="prescriptionDetails"
                name="prescriptionDetails"
                placeholder="Prescription Details"
                defaultValue={`Medication:  
Dosage: : 
Duration: 
Frequency: 
Additional Instructions: `}
                onChange={handleChange}
                value={prescriptionDetails}
                className="w-full h-40 p-4"
              ></Textarea>
            </div>
            <div className="flex justify-center items-center gap-x-6">
              <Button
                color="blue"
                onClick={(e) => {
                  e.preventDefault();
                  setPrescriptionModal(false);
                  handlePrescriptionSubmit(e);
                }}
              >
                Submit
              </Button>
              <Button color="gray" onClick={() => setPrescriptionModal(false)}>
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
