import Department from "../models/department.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (request, response, next) => {
  try {
    const { department_name } = request.body;
    if (!department_name) {
      return next(errorHandler(404, "All fields are required."));
    }
    const newDepartment = new Department({ department_name });
    await newDepartment.save();
    response.status(201).json("Department created successfully.");
  } catch (error) {
    next(error);
  }
};
