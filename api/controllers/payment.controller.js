import Payment from "../models/payment.model.js";
import { errorHandler } from "../utils/error.js";
import stripe from "../utils/stripe.js";

export const createPayment = async (request, response, next) => {
  const { patient_id, appointment_id, payment_amount } = request.body;

  try {
    const validateInput = ({ patient_id, appointment_id, payment_amount }) => {
      if (!patient_id || !appointment_id || !payment_amount) {
        throw new Error("All fields are required.");
      }
      if (isNaN(payment_amount) || payment_amount <= 0) {
        throw new Error("Payment amount must be a positive number.");
      }
    };

    // Convert payment amount to cents
    const amountInCents = Math.round(payment_amount * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Create a new payment record in the database
    const newPayment = new Payment({
      patient_id,
      appointment_id,
      payment_date: new Date(),
      payment_amount: payment_amount,
      payment_status: "Pending",
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
