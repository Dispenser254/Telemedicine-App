import mongoose, { Schema } from "mongoose";

// Define Doctor schema
const doctorSchema = new mongoose.Schema(
  {
    doctor_firstName: {
      type: String,
      required: true,
    },
    doctor_lastName: {
      type: String,
      required: true,
    },
    doctor_idNumber: {
      type: String,
      required: true,
      unique:true
    },
    doctor_profilePic: {
      type: String,
      default:
        "https://imgs.search.brave.com/gV6Xy99WsNTWpgT2KUNxopKhP45u8QMrrL2DGi5HYxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
    },
    doctor_number: {
      type: String,
      required: true,
      unique: true,
    },
    department_id: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
