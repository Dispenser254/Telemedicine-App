/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { HiChevronLeft, HiChevronRight, HiHome } from "react-icons/hi";
import { Breadcrumb, Label, Table, TextInput } from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";

const PrescriptionDetailView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        "/mediclinic/prescription/getAllPrescriptions"
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch prescription data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setPrescriptions(data.prescriptions);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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
              <Link to={"/prescription-list"}>
                <Breadcrumb.Item>Prescription</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Prescriptions
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
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}

      <div className="flex flex-col m-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                  <Table.HeadCell>Patient Name</Table.HeadCell>
                  <Table.HeadCell>Prescription Date</Table.HeadCell>
                  <Table.HeadCell>Prescription Details</Table.HeadCell>
                  <Table.HeadCell>Doctor Name</Table.HeadCell>
                  <Table.HeadCell>Appointment Date</Table.HeadCell>
                  <Table.HeadCell>Appointment Time</Table.HeadCell>
                  <Table.HeadCell>Appointment Status</Table.HeadCell>
                </Table.Head>
                {prescriptions.length > 0 ? (
                  prescriptions?.map((prescription) => (
                    <Table.Body
                      key={prescription?._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.patient_id?.patient_firstName || "N/A"}{" "}
                          {prescription?.patient_id?.patient_lastName || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.prescription_date
                            ? moment(prescription.prescription_date).format(
                                "LL"
                              )
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-pre-line p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.prescription_details || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.doctor_id?.doctor_firstName || "N/A"}{" "}
                          {prescription?.doctor_id?.doctor_lastName || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-pre-wrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_date
                            ? moment(
                                prescription.appointment_id.appointment_date
                              ).format("LL")
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_time
                            ? moment(
                                prescription.appointment_id.appointment_time,
                                "h:mm A"
                              ).format("LT")
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_status ||
                            "N/A"}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="7"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No prescription data found
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Pagination />
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

export default PrescriptionDetailView;
