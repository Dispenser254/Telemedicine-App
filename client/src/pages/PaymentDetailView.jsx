/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  Label,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

const PaymentDetailView = () => {
  const [payments, setPayments] = useState([]);
  const [paymentsPatients, setPaymentsPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const paymentsPerPage = 5;

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/payment/getAllPayments?page=${page}&limit=${paymentsPerPage}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch payments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setPayments(data.payments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchPaymentsByPatientsID = async (patientId, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/payment/getPaymentByPatientID/patient/${patientId}?page=${page}&limit=${paymentsPerPage}`
      );

      if (!response.ok) {
        setErrorMessage("Failed to fetch patient payments data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setPaymentsPatients(data.payments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchPayments();
    } else if (currentUser?.role === "patient") {
      fetchPaymentsByPatientsID(currentUser.patient_id);
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
              <Link to={"/payments-list"}>
                <Breadcrumb.Item>Payments</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Payments
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

      {currentUser?.role === "admin" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Payment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Payment Amount</Table.HeadCell>
                    <Table.HeadCell>Payment Status</Table.HeadCell>
                  </Table.Head>
                  {payments?.length > 0 ? (
                    payments.map((payment) => (
                      <Table.Body
                        key={payment?._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            Kshs.
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    ))
                  ) : (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="5"
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                        >
                          No payments data found
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  )}
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
                    <Table.HeadCell>Payment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Payment Amount</Table.HeadCell>
                    <Table.HeadCell>Payment Status</Table.HeadCell>
                  </Table.Head>
                  {paymentsPatients?.length > 0 ? (
                    paymentsPatients.map((payment) => (
                      <Table.Body
                        key={payment._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            Kshs.{" "}
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    ))
                  ) : (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="5"
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                        >
                          No payments data found
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
      {(currentUser?.role === "admin" || currentUser?.role === "patient") && (
        <PaginationButton
          fetchPayments={fetchPayments}
          fetchPaymentsByPatientsID={fetchPaymentsByPatientsID}
        />
      )}
    </NavbarSidebar>
  );
};

// eslint-disable-next-line react/prop-types
const PaginationButton = ({ fetchPayments, fetchPaymentsByPatientsID }) => {
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;
  const [firstPaymentIndex, setFirstPaymentIndex] = useState(0);
  const [lastPaymentIndex, setLastPaymentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientID = currentUser.patient_id;

  useEffect(() => {
    const fetchPaymentsData = async () => {
      setLoading(true);
      try {
        let response;
        if (currentUser?.role === "admin") {
          response = await fetch(
            `/mediclinic/payment/getAllPayments?page=${currentPage}&limit=${paymentsPerPage}`
          );
        } else if (currentUser?.role === "patient") {
          response = await fetch(
            `/mediclinic/payment/getPaymentByPatientID/patient/${patientID}?page=${currentPage}&limit=${paymentsPerPage}`
          );
        }

        if (!response.ok) {
          toast.error("Failed to fetch departments data.");
        }
        const data = await response.json();
        setTotalPayments(data.totalPayments);
        // Calculate the range of departments being displayed
        const firstIndex = (currentPage - 1) * paymentsPerPage + 1;
        const lastIndex = Math.min(
          currentPage * paymentsPerPage,
          data.totalPayments
        );
        setFirstPaymentIndex(firstIndex);
        setLastPaymentIndex(lastIndex);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPaymentsData();
  }, [currentPage, currentUser]);

  const totalPages = Math.ceil(totalPayments / paymentsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (currentUser?.role === "admin") {
      fetchPayments(page);
    } else if (currentUser?.role === "patient") {
      fetchPaymentsByPatientsID(patientID, page);
    }
  };

  return (
    <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between mt-6 mb-8 p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-y-6 text-center">
          <PropagateLoader size={5} color="#000000" />
        </div>
      ) : (
        <>
          <div>
            <p className="flex gap-x-1 text-md text-gray-700">
              Showing
              <span className="font-semibold text-black">
                {firstPaymentIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastPaymentIndex}
              </span>
              of
              <span className="font-semibold text-black">{totalPayments}</span>
              payments
            </p>
          </div>
          <div className="flex justify-center">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentDetailView;
