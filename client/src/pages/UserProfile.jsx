/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/reducers/authenticationSlice";

const UserProfile = () => {
  const [departments, setDepartments] = useState([]);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser?.patient_id;
  const doctorId = currentUser?.doctor_id;
  const userId = currentUser?._id;
  const dispatch = useDispatch();
  const [patientIdToDelete, setPatientIdToDelete] = useState("");
  const [doctorIdToDelete, setDoctorIdToDelete] = useState("");
  const [userIdToDeactivate, setUserIdToDeactivate] = useState("");
  const [patientModal, setPatientModal] = useState(false);
  const [doctorModal, setDoctorModal] = useState(false);

  const [isOpen, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [patientIdNumber, setPatientIdNumber] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");

  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [doctorNumber, setDoctorNumber] = useState("");
  const [doctorPic, setDoctorPic] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [doctorIdNumber, setDoctorIdNumber] = useState("");

  const [username, setUsername] = useState("");
  const [doctorUsername, setDoctorUsername] = useState("");
  const [email, setEmail] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientFirstName") {
      setPatientFirstName(value);
    } else if (name === "patientLastName") {
      setPatientLastName(value);
    } else if (name === "patientGender") {
      setPatientGender(value);
    } else if (name === "patientIdNumber") {
      setPatientIdNumber(value);
    } else if (name === "patientDob") {
      setPatientDob(value);
    } else if (name === "contactNumber") {
      setContactNumber(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleDoctorUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorUsername") {
      setDoctorUsername(value);
    } else if (name === "doctorEmail") {
      setDoctorEmail(value);
    } else if (name === "doctorPassword") {
      setDoctorPassword(value);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/department/getDepartments");
      if (!response.ok) {
        setErrorMessage("Failed to fetch departments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setDepartments(data.departments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchPatientsByID = async (patientId) => {
    try {
      setLoading(true);
      setLoadingPatient(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/patient/getPatients/${patientId}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch patients by id data.");
        toast.error(errorMessage);
        setLoading(false);
        setLoadingPatient(false);
      }
      const data = await response.json();
      setAddress(data.address || "N/A");
      setContactNumber(data.contact_number || "N/A");
      setPatientGender(data.patient_gender || "N/A");
      setPatientDob(data.patient_dob || "N/A");
      setPatientIdNumber(data.patient_idNumber || "N/A");
      setPatientFirstName(data.patient_firstName || "N/A");
      setPatientLastName(data.patient_lastName || "N/A");
      setLoading(false);
      setLoadingPatient(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingPatient(false);
    }
  };

  const fetchDoctorByID = async (doctorId) => {
    try {
      setLoading(true);
      setLoadingDoctor(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/doctor/getDoctors/doctor/${doctorId}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch doctor by id data.");
        toast.error(errorMessage);
        setLoading(false);
        setLoadingDoctor(false);
      }
      const data = await response.json();
      setDoctorPic(data.doctor_profilePic || "N/A");
      setDoctorNumber(data.doctor_number || "N/A");
      setDoctorDepartment(data.department_id.department_name || "N/A");
      setDoctorIdNumber(data.doctor_idNumber || "N/A");
      setDoctorFirstName(data.doctor_firstName || "N/A");
      setDoctorLastName(data.doctor_lastName || "N/A");
      setLoading(false);
      setLoadingDoctor(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingDoctor(false);
    }
  };

  const fetchUsersByID = async (userId) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (currentUser?.role === "patient") {
        setLoadingPatient(true);
        const response = await fetch(`/mediclinic/auth/getUsers/${userId}`);
        if (!response.ok) {
          setErrorMessage("Failed to fetch user by id data.");
          toast.error(errorMessage);
          setLoading(false);
          setLoadingPatient(false);
        }
        const data = await response.json();
        setUsername(data.username || "N/A");
        setEmail(data.email || "N/A");
        setLoading(false);
        setLoadingPatient(false);
      } else if (currentUser?.role === "doctor") {
        setLoadingDoctor(true);
        const response = await fetch(`/mediclinic/auth/getUsers/${userId}`);
        if (!response.ok) {
          setErrorMessage("Failed to fetch user by id data.");
          toast.error(errorMessage);
          setLoading(false);
          setLoadingDoctor(false);
        }
        const data = await response.json();
        setDoctorUsername(data.username || "N/A");
        setDoctorEmail(data.email || "N/A");
        setLoading(false);
        setLoadingDoctor(false);
      }
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingPatient(false);
      setLoadingDoctor(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (currentUser?.role === "patient") {
        const response = await fetch(
          `/mediclinic/patient/getPatients/${patientIdToDelete}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          setErrorMessage("Failed to delete patient");
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
        setLoading(false);
        dispatch(signoutSuccess());
        toast.success("Patient deleted successfully");
      } else if (currentUser?.role === "doctor") {
        const response = await fetch(
          `/mediclinic/doctor/getDoctors/${doctorIdToDelete}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          setErrorMessage("Failed to delete doctor");
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
        setLoading(false);
        dispatch(signoutSuccess());
        toast.success("Doctor deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/auth/deactivate/${userIdToDeactivate}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to deactivate user");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      setLoading(false);
      dispatch(signoutSuccess());
      toast.success("User deactivated successfully");
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
        address: address,
        patient_firstName: patientFirstName,
        patient_lastName: patientLastName,
        patient_gender: patientGender,
        patient_dob: patientDob,
        patient_idNumber: patientIdNumber,
        contact_number: contactNumber,
      };
      const response = await fetch(
        `/mediclinic/patient/getPatients/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update patient details");
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      fetchPatientsByID(patientId);
      // Combine data info with the success message and add line breaks
      const successMessage = `
            Patient updated successfully
          `;

      // Show the success message as HTML
      toast.success(successMessage);
      setPatientModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        department_id: doctorDepartment,
        doctor_firstName: doctorFirstName,
        doctor_lastName: doctorLastName,
        doctor_profilePic: doctorPic,
        doctor_idNumber: doctorIdNumber,
        doctor_number: doctorNumber,
      };
      const response = await fetch(
        `/mediclinic/doctor/getDoctors/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update doctor details");
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      fetchDoctorByID(doctorId);
      // Combine data info with the success message and add line breaks
      const successMessage = `
            Doctor updated successfully
          `;

      // Show the success message as HTML
      toast.success(successMessage);
      setDoctorModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedData = {
        username: username,
        email: email,
        password: password,
      };
      const response = await fetch(`/mediclinic/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        toast.error("Failed to update user details");
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      fetchUsersByID(userId);
      // Combine data info with the success message and add line breaks
      const successMessage = `
            User details updated successfully
          `;

      // Show the success message as HTML
      toast.success(successMessage);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDoctorUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedData = {
        username: doctorUsername,
        email: doctorEmail,
        password: doctorPassword,
      };
      const response = await fetch(`/mediclinic/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        toast.error("Failed to update user details");
      }
      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      fetchUsersByID(userId);
      // Combine data info with the success message and add line breaks
      const successMessage = `
            User details updated successfully
          `;

      // Show the success message as HTML
      toast.success(successMessage);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsersByID(userId);
    if (currentUser?.role === "doctor") {
      fetchDepartments();
      fetchDoctorByID(doctorId);
    } else if (currentUser?.role === "patient") {
      fetchPatientsByID(patientId);
    }
  }, [currentUser]);

  return (
    <NavbarSidebar isFooter={true}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item>
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/user-profile">
                User Profile
              </Breadcrumb.Item>
              <Breadcrumb.Item>Profile</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              User Profile
            </h1>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <div className="flex flex-col m-4">
        {currentUser?.role === "doctor" && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow items-center">
                <div>
                  <Card className="items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      Doctor Details
                    </h1>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorFirstName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor First Name
                        </Label>
                        <TextInput
                          id="doctorFirstName"
                          name="doctorFirstName"
                          type="text"
                          value={doctorFirstName}
                          disabled
                          placeholder="Enter Doctor Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorLastName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Last Name
                        </Label>
                        <TextInput
                          id="doctorLastName"
                          name="doctorLastName"
                          type="text"
                          value={doctorLastName}
                          disabled
                          placeholder="Enter Doctor Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorIdNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor ID Number
                        </Label>
                        <TextInput
                          id="doctorIdNumber"
                          name="doctorIdNumber"
                          type="text"
                          value={doctorIdNumber}
                          disabled
                          placeholder="Enter Doctor ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorEmail"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Email
                        </Label>
                        <TextInput
                          id="doctorEmail"
                          name="doctorEmail"
                          type="email"
                          value={doctorEmail}
                          disabled
                          placeholder="Enter Doctor Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorDepartment"
                          className="mb-2 block text-gray-700"
                        >
                          Department Name
                        </Label>
                        <TextInput
                          id="doctorDepartment"
                          name="doctorDepartment"
                          type="text"
                          value={doctorDepartment}
                          disabled
                          placeholder="Enter Department Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Contact
                        </Label>
                        <TextInput
                          id="doctorNumber"
                          name="doctorNumber"
                          type="text"
                          value={doctorNumber}
                          disabled
                          placeholder="Enter Doctor Contact"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      gradientDuoTone="cyanToBlue"
                      onClick={() => {
                        setDoctorModal(true);
                        fetchDoctorByID(doctorId);
                      }}
                    >
                      Update
                    </Button>
                  </Card>
                </div>
                <div>
                  <Card className="">
                    <h1 className="text-xl mx-10 font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      Other Details
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div>
                        <Avatar bordered color="success" size="xl" />
                      </div>
                      <div className="mt-2">
                        <div className="mb-4">
                          <Label
                            htmlFor="doctorUsername"
                            className="mb-2 block text-gray-700"
                          >
                            Username
                          </Label>
                          <TextInput
                            id="doctorUsername"
                            name="doctorUsername"
                            type="text"
                            value={doctorUsername}
                            onChange={handleDoctorUserChange}
                            placeholder="Enter Doctor Name"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="doctorEmail"
                            className="mb-2 block text-gray-700"
                          >
                            Email Address
                          </Label>
                          <TextInput
                            id="doctorEmail"
                            name="doctorEmail"
                            type="email"
                            value={doctorEmail}
                            onChange={handleDoctorUserChange}
                            placeholder="Enter Email Address"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="departmentName"
                            className="mb-2 block text-gray-700"
                          >
                            Password
                          </Label>
                          <TextInput
                            id="departmentName"
                            name="departmentName"
                            type="password"
                            value={doctorPassword}
                            onChange={handleDoctorUserChange}
                            placeholder="password"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      gradientDuoTone="purpleToPink"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDoctorUserSubmit(e);
                      }}
                    >
                      Update User
                    </Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button
                      color="failure"
                      onClick={() => {
                        setOpen(true);
                        setDoctorIdToDelete(doctorId);
                      }}
                    >
                      Delete Account
                    </Button>
                    <Button
                      color="warning"
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDeactivate(userId);
                      }}
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {currentUser?.role === "patient" && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow items-center">
                <div>
                  <Card className="items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      Patient Details
                    </h1>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="patientFirstName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient First Name
                        </Label>
                        <TextInput
                          id="patientFirstName"
                          name="patientFirstName"
                          type="text"
                          value={patientFirstName}
                          disabled
                          placeholder="Enter Patient's First Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="patientLastName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Last Name
                        </Label>
                        <TextInput
                          id="patientLastName"
                          name="patientLastName"
                          type="text"
                          value={patientLastName}
                          disabled
                          placeholder="Enter Patient's Last Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="patientIdNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Patient ID Number
                        </Label>
                        <TextInput
                          id="patientIdNumber"
                          name="patientIdNumber"
                          type="text"
                          value={patientIdNumber}
                          disabled
                          placeholder="Enter Patient's ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="patientDob"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Date of Birth
                        </Label>
                        <TextInput
                          id="patientDob"
                          name="patientDob"
                          type="text"
                          value={new Date(patientDob).toLocaleDateString()}
                          disabled
                          placeholder="Enter Patient's Date of Birth"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="patientGender"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Gender
                        </Label>
                        <TextInput
                          id="patientGender"
                          name="patientGender"
                          type="text"
                          value={patientGender}
                          disabled
                          placeholder="Enter Patient Gender"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="contactNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Contact
                        </Label>
                        <TextInput
                          id="contactNumber"
                          name="contactNumber"
                          type="text"
                          value={contactNumber}
                          disabled
                          placeholder="Enter Patient Contact"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="address"
                        className="mb-2 block text-gray-700"
                      >
                        Address
                      </Label>
                      <TextInput
                        id="address"
                        name="address"
                        type="text"
                        value={address}
                        disabled
                        placeholder="Enter Address"
                        required
                      />
                    </div>
                    <Button
                      gradientDuoTone="cyanToBlue"
                      onClick={() => {
                        setPatientModal(true);
                        fetchPatientsByID(patientId);
                      }}
                    >
                      Update
                    </Button>
                  </Card>
                </div>
                <div>
                  <Card>
                    <h1 className="text-xl mx-10 font-semibold text-gray-900 dark:text-white sm:text-2xl">
                      Other Details
                    </h1>
                    <div className="mx-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="username"
                          className="mb-2 block text-gray-700"
                        >
                          Username
                        </Label>
                        <TextInput
                          id="username"
                          name="username"
                          type="text"
                          value={username}
                          onChange={handleUserChange}
                          placeholder="Enter Username"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="email"
                          className="mb-2 block text-gray-700"
                        >
                          Email Address
                        </Label>
                        <TextInput
                          id="email"
                          name="email"
                          type="text"
                          value={email}
                          onChange={handleUserChange}
                          placeholder="Enter User Email"
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="email"
                          className="mb-2 block text-gray-700"
                        >
                          Password
                        </Label>
                        <TextInput
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={handleUserChange}
                          placeholder="password"
                        />
                      </div>
                    </div>
                    <Button
                      gradientDuoTone="purpleToPink"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUserSubmit(e);
                      }}
                    >
                      Update User
                    </Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button
                      color="failure"
                      onClick={() => {
                        setOpen(true);
                        setPatientIdToDelete(patientId);
                      }}
                    >
                      <div className="flex items-center gap-x-2">
                        <HiTrash className="text-lg" />
                        Delete Account
                      </div>
                    </Button>
                    <Button
                      color="warning"
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDeactivate(userId);
                      }}
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
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

      <Modal onClose={() => setOpenModal(false)} show={isOpenModal} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Deactivate user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to deactivate this user?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleDeactivate();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        onClose={() => setPatientModal(false)}
        show={patientModal}
        size="md"
      >
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Patient</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          {loadingPatient && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Patient First Name
                </Label>
                <TextInput
                  id="patientFirstName"
                  name="patientFirstName"
                  type="text"
                  value={patientFirstName}
                  onChange={handleChange}
                  placeholder="Enter Patient's First Name"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="patientLastName"
                  className="mb-2 block text-gray-700"
                >
                  Patient Last Name
                </Label>
                <TextInput
                  id="patientLastName"
                  name="patientLastName"
                  type="text"
                  value={patientLastName}
                  onChange={handleChange}
                  placeholder="Enter Patient's Last Name"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientIdNumber"
                  className="mb-2 block text-gray-700"
                >
                  Patient ID Number
                </Label>
                <TextInput
                  id="patientIdNumber"
                  name="patientIdNumber"
                  type="text"
                  value={patientIdNumber}
                  onChange={handleChange}
                  placeholder="Enter Patient's ID Number"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="patientDob"
                  className="mb-2 block text-gray-700"
                >
                  Patient Date of Birth
                </Label>
                <TextInput
                  id="patientDob"
                  name="patientDob"
                  type="text"
                  value={new Date(patientDob).toLocaleDateString()}
                  onChange={handleChange}
                  placeholder="Enter Patient's Date of Birth"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientGender"
                  className="mb-2 block text-gray-700"
                >
                  Patient Gender
                </Label>
                <TextInput
                  id="patientGender"
                  name="patientGender"
                  type="text"
                  value={patientGender}
                  onChange={handleChange}
                  placeholder="Enter Patient Gender"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="contactNumber"
                  className="mb-2 block text-gray-700"
                >
                  Patient Contact
                </Label>
                <TextInput
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  value={contactNumber}
                  onChange={handleChange}
                  placeholder="Enter Patient Contact"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="address" className="mb-2 block text-gray-700">
                Address
              </Label>
              <TextInput
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={handleChange}
                placeholder="Enter Address"
                required
              />
            </div>

            <div className="flex items-center gap-x-6">
              <Button color="blue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button color="gray" onClick={() => setPatientModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal onClose={() => setDoctorModal(false)} show={doctorModal} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Doctor</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          {loadingDoctor && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleDoctorSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="doctorFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Doctor First Name
                </Label>
                <TextInput
                  id="doctorFirstName"
                  name="doctorFirstName"
                  type="text"
                  value={doctorFirstName}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Name"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="doctorLastName"
                  className="mb-2 block text-gray-700"
                >
                  Doctor Last Name
                </Label>
                <TextInput
                  id="doctorLastName"
                  name="doctorLastName"
                  type="text"
                  value={doctorLastName}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Name"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="doctorIdNumber"
                  className="mb-2 block text-gray-700"
                >
                  Doctor ID Number
                </Label>
                <TextInput
                  id="doctorIdNumber"
                  name="doctorIdNumber"
                  type="text"
                  value={doctorIdNumber}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor ID Number"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="doctorEmail"
                  className="mb-2 block text-gray-700"
                >
                  Doctor Email
                </Label>
                <TextInput
                  id="doctorEmail"
                  name="doctorEmail"
                  type="email"
                  value={doctorEmail}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Email"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label htmlFor="doctorDepartment" className="mb-2">
                  Department Name
                </Label>
                <Select
                  id="doctorDepartment"
                  name="doctorDepartment"
                  onChange={handleDoctorUserChange}
                  required
                  disabled={loadingDoctor}
                >
                  {loadingDoctor ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    <>
                      <option value={doctorDepartment}></option>
                      {departments?.map((dep) => (
                        <option key={dep?._id} value={dep?._id}>
                          {dep?.department_name}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="doctorNumber"
                  className="mb-2 block text-gray-700"
                >
                  Doctor Contact
                </Label>
                <TextInput
                  id="doctorNumber"
                  name="doctorNumber"
                  type="text"
                  value={doctorNumber}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Contact"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-x-6">
              <Button color="blue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button color="gray" onClick={() => setDoctorModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </NavbarSidebar>
  );
};

export default UserProfile;
