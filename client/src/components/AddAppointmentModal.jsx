/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiPlus, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddAppointmentModal = ({ onAppointmentAdded }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser?.patient_id;
  const [showCredentials, setShowCredentials] = useState(false);

  const handleGoBack = () => {
    setShowCredentials(false);
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/department/getDepartments");
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage("Failed to fetch department data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      setDepartments(data.departments);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData || !formData.appointment_date) {
      errors.appointment_date = "Appointment Date is required.";
    }
    if (!formData || !formData.appointment_time) {
      errors.appointment_time = "Appointment Time is required.";
    }
    if (!formData || !formData.appointment_type) {
      errors.appointment_type = "Appointment Type is required.";
    }
    if (!formData || !formData.department_id) {
      errors.department_id = "Department ID is required.";
    }
    return errors;
  };

  const handleAppointmentDetailsSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
    } else {
      setErrorMessage(null);
      setShowCredentials(true);
    }
  };

  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      // Add patient_id to formData
      const formDataWithPatientId = {
        ...formData,
        patient_id: patientId,
      };

      const response = await fetch(
        "/mediclinic/appointment/createAppointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataWithPatientId),
        }
      );

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
      }
      setOpen(false);
      setLoading(false);
      toast.success("Appointment created successfully");
      if (onAppointmentAdded) {
        onAppointmentAdded();
      }
      navigate("/payments");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Appointment
        </div>
      </Button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="md:mx-auto mx-4 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
            {!showCredentials ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                  Add New <span className="text-yellow-300">Appointment</span>
                </h2>
                <form className="flex flex-col">
                  <div className="grid grid-cols-1 gap-2 lg:gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="mb-4">
                      <Label htmlFor="appointmentDate" className="mb-2">
                        Appointment Date
                      </Label>
                      <TextInput
                        type="date"
                        id="appointment_date"
                        name="appointmentDate"
                        placeholder="Appointment Date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        required
                      />
                      {errorMessage?.appointment_date && (
                        <p className="text-red-500">
                          {errorMessage.appointment_date}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="appointmentTime" className="mb-2">
                        Appointment Time
                      </Label>
                      <TextInput
                        type="time"
                        id="appointment_time"
                        name="appointmentTime"
                        placeholder="Appointment Time"
                        onChange={handleChange}
                        required
                      />
                      {errorMessage?.appointment_time && (
                        <p className="text-red-500">
                          {errorMessage.appointment_time}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="gender"
                        className="mb-2 block text-gray-700"
                      >
                        Select Appointment Type
                      </Label>
                      <Select
                        id="appointment_type"
                        name="appointmentType"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Online">Online</option>
                      </Select>
                      {errorMessage?.appointment_type && (
                        <p className="text-red-500">
                          {errorMessage.appointment_type}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="departmentId" className="mb-2">
                        Department
                      </Label>
                      <Select
                        id="department_id"
                        name="departmentId"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </Select>
                      {errorMessage?.department_id && (
                        <p className="text-red-500">
                          {errorMessage.department_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      color="failure"
                      className="justify-end"
                      onClick={() => setOpen(false)}
                    >
                      <HiX className=" h-5 w-5 mr-2" />
                      Close
                    </Button>
                    <Button
                      size="lg"
                      type="submit"
                      className="bg-blue-400 hover:bg-blue-500 justify-end"
                      outline
                      onClick={handleSubmit}
                    >
                      Proceed to Payment
                      <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                  Appointment <span className="text-yellow-300">Signup</span>
                </h2>
                <form
                  className="flex flex-col md:flex-row items-center justify-center gap-4"
                  onSubmit={handleSubmit}
                >
                  <div className="md:flex md:flex-col">
                    <div className="mb-4">
                      <Label htmlFor="username">Username</Label>
                      <TextInput
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                      />
                      {errorMessage?.username && (
                        <p className="text-red-500">{errorMessage.username}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="password">Enter Password</Label>
                      <TextInput
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                      />
                      {errorMessage?.password && (
                        <p className="text-red-500">{errorMessage.password}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <TextInput
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                      />
                      {errorMessage?.confirmPassword && (
                        <p className="text-red-500">
                          {errorMessage.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={loading}
                        onClick={handleAppointmentDetailsSubmit}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Proceed to Payment"
                        )}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-400 hover:bg-blue-600"
                        outline
                        onClick={handleGoBack}
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddAppointmentModal;
