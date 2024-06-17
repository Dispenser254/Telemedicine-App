import { Card } from "flowbite-react";

const AdminDashboardGrid = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card href="/patients-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Patients
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
        <Card href="" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Pending Appointment Requests
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
        <Card href="#" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Confirmed Appointments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
        <Card href="/doctors-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Doctors
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
        <Card href="/payments-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Payments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
        <Card href="/video-consultation" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Video Consultation
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">6</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardGrid
