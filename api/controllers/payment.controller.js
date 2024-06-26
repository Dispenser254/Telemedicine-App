import Payment from "../models/payment.model.js";
import { errorHandler } from "../utils/error.js";
import stripe from "../utils/stripe.js";

// Get all payments
export const getAllPayments = async (request, response, next) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_type appointment_status",
      })
      .lean();

    const totalPayments = await Payment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPayments = await Payment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response
      .status(200)
      .json({ payments, totalPayments, lastMonthPayments });
  } catch (error) {
    next(errorHandler(500, "Error retrieving payments from the database"));
  }
};

// Get an payments by Patient ID
export const getPaymentByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const payment = await Payment.find({
      patient_id: patientId,
    })
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_type appointment_status",
      })
      .lean();

    if (!payment) {
      return next(errorHandler(404, "Patient Payment not found"));
    }
    response.status(200).json(payment);
  } catch (error) {
    next(
      errorHandler(500, "Error retrieving patient payments from the database")
    );
  }
};

export const createPayment = async (request, response, next) => {
  const { patient_id, appointment_id, payment_amount } = request.body;

  try {
    if (!patient_id || !appointment_id || !payment_amount) {
      throw new Error("All fields are required.");
    }
    if (isNaN(payment_amount) || payment_amount <= 0) {
      throw new Error("Payment amount must be a positive number.");
    }

    // Convert payment amount to cents
    const amountInCents = Math.round(payment_amount * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "kes",
      payment_method_types: ["card"],
    });

    // Create a new payment record in the database
    const newPayment = new Payment({
      patient_id,
      appointment_id,
      payment_date: new Date(),
      payment_amount: payment_amount,
      payment_status: "Paid",
    });

    // Save the new payment to the database
    await newPayment.save();

    // Return the client secret for Stripe to the client
    response.status(201).json({
      success: true,
      id: newPayment._id,
      clientSecret: paymentIntent.client_secret,
      message: "Payment initiated, complete the payment on the client side",
    });
  } catch (error) {
    console.log("Error creating payment:", error);
    next(errorHandler(500, "Error creating payment."));
  }
};
