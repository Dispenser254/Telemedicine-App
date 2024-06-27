/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import {
  //   HiChevronLeft,
  //   HiChevronRight,
  HiHome,
  //   HiOutlineExclamationCircle,
  //   HiPlus,
  //   HiTrash,
} from "react-icons/hi";
import {
    Avatar,
  Breadcrumb,
  Button,
  //   Button,
  Card,
  Label,
  TextInput,
  //   Label,
  //   Modal,
  //   Spinner,
  //   Table,
  //   TextInput,
  //   Textarea,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { ScaleLoader } from "react-spinners";
// import { toast } from "react-toastify";
// import { FaEdit } from "react-icons/fa";

const UserProfile = () => {
  const { currentUser } = useSelector((state) => state.authentication);
  //   const [patient, setPatient] = useState([]);
  //   const [doctor, setDoctor] = useState([]);
  //   const [patientIdToDelete, setPatientIdToDelete] = useState("");
  //   const [departmentModal, setDepartmentModal] = useState(false);
  //   const [isOpen, setOpen] = useState(false);
  //   const [errorMessage, setErrorMessage] = useState(null);
  //   const [loading, setLoading] = useState(false);
  //   const [loadingDepartment, setLoadingDepartment] = useState(false);

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     if (name === "departmentName") {
  //       setDepartmentName(value);
  //     } else if (name === "departmentDescription") {
  //       setDepartmentDescription(value);
  //     }
  //   };

  //   const fetchDepartments = async () => {
  //     try {
  //       setLoading(true);
  //       setErrorMessage(null);
  //       const response = await fetch("/mediclinic/department/getDepartments");
  //       if (!response.ok) {
  //         setErrorMessage("Failed to fetch departments data.");
  //         toast.error(errorMessage);
  //         setLoading(false);
  //       }
  //       const data = await response.json();
  //       setDepartment(data.departments);
  //       setLoading(false);
  //     } catch (error) {
  //       toast.error(error.message);
  //       setErrorMessage(error.message);
  //     }
  //   };

  //   const fetchDepartmentByID = async (departmentID) => {
  //     try {
  //       setLoadingDepartment(true);
  //       setErrorMessage(null);

  //       const response = await fetch(
  //         `/mediclinic/department/getDepartments/${departmentID}`
  //       );
  //       if (!response.ok) {
  //         setErrorMessage("Failed to fetch selected department data.");
  //         toast.error(errorMessage);
  //         setLoadingDepartment(false);
  //       }
  //       const data = await response.json();
  //       setDepartmentName(data.department_name || "N/A");
  //       setDepartmentDescription(data.department_description || "N/A");
  //       setLoadingDepartment(false);
  //     } catch (error) {
  //       toast.error(error.message);
  //       setErrorMessage(error.message);
  //       setLoadingDepartment(false);
  //     }
  //   };

  //   const handleDelete = async () => {
  //     try {
  //       setLoading(true);
  //       setErrorMessage(null);
  //       const response = await fetch(
  //         `/mediclinic/department/getDepartments/${departmentIdToDelete}`,
  //         { method: "DELETE" }
  //       );
  //       if (!response.ok) {
  //         setErrorMessage("Failed to delete department");
  //         toast.error(errorMessage);
  //         setLoading(false);
  //         return;
  //       }
  //       // Filter out the deleted doctor from the local state
  //       setDepartment(
  //         department.filter((dep) => dep._id !== departmentIdToDelete)
  //       );
  //       // Fetch the updated list of doctor after deletion
  //       fetchDepartments();
  //       setLoading(false);
  //       toast.success("Department deleted successfully");
  //     } catch (error) {
  //       toast.error(error.message);
  //       setErrorMessage(error.message);
  //     }
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       setLoading(true);
  //       const response = await fetch(
  //         `/mediclinic/department/getDepartments/${departmentId}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             department_name: departmentName,
  //             department_description: departmentDescription,
  //           }),
  //         }
  //       );
  //       if (!response.ok) {
  //         toast.error("Failed to update department");
  //       }
  //       const data = await response.json();
  //       fetchDepartments();
  //       // Combine data info with the success message and add line breaks
  //       const successMessage = `
  //       Department updated successfully:
  //       <br> <b>Department Name</b>: <i>${data.department_name}</i>
  //       <br> <b>Department Description</b>: <i>${data.department_description}</i>
  //     `;

  //       // Show the success message as HTML
  //       toast.success(
  //         <div dangerouslySetInnerHTML={{ __html: successMessage }} />
  //       );
  //       setDepartmentModal(false);
  //       setLoading(false);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchDepartments();
  //   }, []);

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
      {/* {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )} */}
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
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor First Name
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Last Name
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor ID Number
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Doctor ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Email
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="date"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Doctor Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Department Name
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Department Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Contact
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Doctor Contact"
                          required
                        />
                      </div>
                    </div>
                    <Button gradientDuoTone="cyanToBlue">Update</Button>
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
                            htmlFor="departmentName"
                            className="mb-2 block text-gray-700"
                          >
                            Doctor Username
                          </Label>
                          <TextInput
                            id="departmentName"
                            name="departmentName"
                            type="text"
                            // value={departmentName}
                            // onChange={handleChange}
                            placeholder="Enter Doctor Name"
                            required
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
                            // value={departmentName}
                            // onChange={handleChange}
                            placeholder="Enter Doctor Name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button gradientDuoTone="purpleToPink">Update User</Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button color="failure">Delete Account</Button>
                    <Button color="warning">Deactivate Account</Button>
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
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient First Name
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Last Name
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient ID Number
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Date of Birth
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="date"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Date of Birth"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Gender
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Gender"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Contact
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Contact"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="departmentName"
                        className="mb-2 block text-gray-700"
                      >
                        Address
                      </Label>
                      <TextInput
                        id="departmentName"
                        name="departmentName"
                        type="text"
                        // value={departmentName}
                        // onChange={handleChange}
                        placeholder="Enter Address"
                        required
                      />
                    </div>
                    <Button gradientDuoTone="cyanToBlue">Update</Button>
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
                          htmlFor="departmentName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Username
                        </Label>
                        <TextInput
                          id="departmentName"
                          name="departmentName"
                          type="text"
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
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
                          // value={departmentName}
                          // onChange={handleChange}
                          placeholder="Enter Patient Name"
                          required
                        />
                      </div>
                    </div>
                    <Button gradientDuoTone="purpleToPink">Update User</Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button color="failure">Delete Account</Button>
                    <Button color="warning">Deactivate Account</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavbarSidebar>
  );
};

export default UserProfile;
