import mongoose from "mongoose";

// Define department Schema
const departmentSchema = new mongoose.Schema(
  {
    department_name: {
      type: String,
      requred: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
