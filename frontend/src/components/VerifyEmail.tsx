import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../services/userpool";
import { useNavigate, useLocation } from "react-router-dom";
import "@/assets/styles/Button.css";
import "@/assets/styles/Authentication.css";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  const location = useLocation();
  const email = location.state?.email || "";

  console.log("get email from location.state:", email);
  // const email = email_address;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Verification code is required.");
      return;
    }
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    try {
      await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(verificationCode, true, (err, data) => {
          if (err) {
            reject(err);
            return;
          } else {
            resolve(data);
          }
        });
      });

      setError("Email verified successfully! You can now log in.");
      setTimeout(() => {
        navigate("/login"); // Change to the desired page
      }, 4000);
    } catch (err) {
      if (err instanceof Error) setError("Error verifying email.");
    }
  };

  return (
    <div className="login-container flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="login-box sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Verify Email</h2>
        <form onSubmit={handleSubmit}>
          <h3>Email Verification</h3>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
              // onChange={(e) => setEmail(e.target.value)}
              readOnly
              placeholder="Email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
            />
          </div>
          <p className="login-error">{error ? error : ""}</p>
          <div className="buttons-default">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              Verify Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
