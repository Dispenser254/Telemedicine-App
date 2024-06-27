import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminDashboardGrid = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalVideoConsultations, setTotalVideoConsultations] = useState(0);
  const [totalPendingAppointments, setTotalPendingAppointments] = useState(0);
  const [totalConfirmedAppointments, setTotalConfirmedAppointments] =
    useState(0);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/mediclinic/patient/getPatients");
      if (!response.ok) {
        toast.error("Failed to fetch patients data");
      }
      const data = await response.json();
      setTotalPatients(data.totalPatients);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/mediclinic/doctor/getDoctors");
      if (!response.ok) {
        toast.error("Failed to fetch doctors data");
      }
      const data = await response.json();
      setTotalDoctors(data.totalDoctors);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch("/mediclinic/payment/getAllPayments");
      if (!response.ok) {
        toast.error("Failed to fetch payments data");
      }
      const data = await response.json();
      setTotalPayments(data.totalPayments);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchVideoConsultations = async () => {
    try {
      const response = await fetch("/mediclinic/video/getVideoConsultations");
      if (!response.ok) {
        toast.error("Failed to fetch video consultation data");
      }
      const data = await response.json();
      setTotalVideoConsultations(data.totalVideoConsultations);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/mediclinic/appointment/getAppointments");
      if (!response.ok) {
        toast.error("Failed to fetch appointments data");
        return;
      }
      const data = await response.json();
      setTotalConfirmedAppointments(data.totalConfirmedAppointments);
      setTotalPendingAppointments(data.totalPendingAppointments);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchVideoConsultations();
    fetchAppointments();
    fetchPayments();
  }, []);

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card href="/patients-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Patients
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPatients}
            </p>
          </div>
        </Card>
        <Card href="" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Pending Appointment Requests
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPendingAppointments}
            </p>
          </div>
        </Card>
        <Card href="#" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Confirmed Appointments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalConfirmedAppointments}
            </p>
          </div>
        </Card>
        <Card href="/doctors-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Doctors
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalDoctors}
            </p>
          </div>
        </Card>
        <Card href="/payments-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Payments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPayments}
            </p>
          </div>
        </Card>
        <Card href="/video-consultation" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Video Consultation
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalVideoConsultations}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardGrid;
