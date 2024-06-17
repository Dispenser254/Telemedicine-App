/* eslint-disable react/no-unescaped-entities */
import { Button, Modal, Table } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";

const AllPatientsTable = () => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Position</Table.HeadCell>
        <Table.HeadCell>Country</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
            <img
              className="h-10 w-10 rounded-full"
              src="../../images/users/neil-sims.png"
              alt="Neil Sims avatar"
            />
            <Link to={"/"}>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Neil Sims
                </div>
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  neil.sims@flowbite.com
                </div>
              </div>
            </Link>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Front-end developer
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            United States
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
            <div className="flex items-center">
              <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
              Active
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <DeleteUserModal />
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

const DeleteUserModal = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Delete
        </div>
      </Button>
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
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => setOpen(false)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AllPatientsTable;
