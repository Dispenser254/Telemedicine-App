import Department from "../models/department.model.js";
import { errorHandler } from "../utils/error.js";

// Get all departments
export const getAllDepartments = async (request, response, next) => {
  try {
    const departments = await Department.find();

    const totalDepartments = await Department.countDocuments();
    response.status(200).json({ departments, totalDepartments });
  } catch (error) {
    next(errorHandler(500, "Error retrieving departments from the database"));
  }
};

export const getDepartmentByID = async (request, response, next) => {
  const departmentId = request.params.id;
  try {
    const department = await Department.findById(departmentId);

    if (!department) {
      return next(errorHandler(404, "Department not found"));
    }
    response.status(200).json(department);
  } catch (error) {
    next(errorHandler(500, "Error retrieving departments from the database"));
  }
};

// Create a department
export const createDepartment = async (request, response, next) => {
  try {
    const { department_name, department_description } = request.body;
    if (!department_name) {
      return next(errorHandler(404, "Department name is required."));
    }
    const newDepartment = new Department({
      department_name,
      department_description,
    });
    await newDepartment.save();
    response.status(201).json("Department created successfully.");
  } catch (error) {
    next(errorHandler(500, "Error creating department"));
  }
};

// Update a department
export const updateDepartment = async (request, response, next) => {
  const departmentId = request.params.id;
  const { department_name, department_description } = request.body;
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { department_name, department_description },
      { new: true, runValidators: true }
    );
    if (!updatedDepartment) {
      return next(errorHandler(404, "Department not found"));
    }
    response.status(200).json(updatedDepartment);
  } catch (error) {
    next(errorHandler(500, "Error updating department"));
  }
};

// Delete a department
export const deleteDepartment = async (request, response, next) => {
  const departmentId = request.params.id;

  try {
    // Find the department by ID to get the user_id
    const department = await Department.findById(departmentId);

    if (!department) {
      return next(errorHandler(404, "Department not found"));
    }

    // Delete the department
    await Department.findByIdAndDelete(departmentId);
    response.status(200).json("Department deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting Department"));
  }
};
