import "react-credit-cards-2/dist/es/styles-compiled.css";
import Cards from "react-credit-cards-2";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const AddPaymentModal = () => {
  const [cardNumber, setCardNumber] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [payment_amount, setPayment_amount] = useState("75");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCVC] = useState("");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState("");
  const [errors, setErrors] = useState({});

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, ""); 
    setCardNumber(value);
    validateCardNumber(value);
  };

  const handleExpiryChange = (event) => {
    const value = event.target.value.replace(/\D/g, ""); 
    setExpiry(value);
    validateExpiry(value);
  };

  const handleCVCChange = (event) => {
    const value = event.target.value.replace(/\D/g, ""); 
    setCVC(value);
    validateCVC(value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const validateCardNumber = (value) => {
    const maxLength = 16;
    if (value.length !== maxLength) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardNumber: `Card number should be ${maxLength} digits`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardNumber: "",
      }));
    }
  };

  const validateExpiry = (value) => {
    const maxLength = 4;
    if (value.length !== maxLength) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        expiry: "Invalid expiry date",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        expiry: "",
      }));
    }
  };

  const validateCVC = (value) => {
    const maxLength = 3;
    if (value.length !== maxLength) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvc: `Entered Invalid CVC`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvc: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="md:mx-auto mx-4 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center uppercase">
            Add New <span className="text-yellow-300">Appointment</span>
          </h2>
          <div className="flex flex-col">
            <Cards
              number={cardNumber}
              name={name}
              expiry={expiry}
              cvc={cvc}
              focused={focused}
            />
            <div className="flex flex-col">
              <Label htmlFor="cardNumber" className="text-gray-700">
                Card Number:
              </Label>
              <TextInput
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onFocus={() => setFocused("number")}
                maxLength={16}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.cardNumber && (
                <span className="text-red-500">{errors.cardNumber}</span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="name" className="text-gray-700">
                Card Holder Name:
              </Label>
              <TextInput
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleNameChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="expiry" className="text-gray-700">
                Expiry Date:
              </Label>
              <TextInput
                type="text"
                id="expiry"
                name="expiry"
                value={expiry}
                onChange={handleExpiryChange}
                onFocus={() => setFocused("expiry")}
                maxLength={4}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.expiry && (
                <span className="text-red-500">{errors.expiry}</span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="cvc" className="text-gray-700">
                CVC:
              </Label>
              <TextInput
                type="text"
                id="cvc"
                name="cvc"
                value={cvc}
                onChange={handleCVCChange}
                onFocus={() => setFocused("cvc")}
                maxLength={3}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.cvc && <span className="text-red-500">{errors.cvc}</span>}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="cardNumber" className="text-gray-700">
                Amount:$
              </Label>
              <TextInput
                disabled
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={payment_amount}
                maxLength={16}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.cardNumber && (
                <span className="text-red-500">{errors.cardNumber}</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              Please note that your card will not be charged until the
              appointment request is approved. Thank you for your understanding.
            </p>
            <Button
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
