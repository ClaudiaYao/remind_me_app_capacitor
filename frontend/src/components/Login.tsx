import React from "react";
import { useAuth } from "../hooks/useAuth";
import "@/assets/styles/Button.css";
import "@/assets/styles/Authentication.css";
import { CognitoAuthError, CognitoErrorCode } from "@/services/appExceptions";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!email || !password) {
      setMsg("Both fields are required.");
      return;
    }

    try {
      setEmail(email);
      setPassword(password);
      console.log("email:", email);
      await login({ email, password });
      await sleep(1000);
      navigate("/");
    } catch (error) {
      if (error instanceof CognitoAuthError) {
        switch (error.code) {
          case CognitoErrorCode.UserNotConfirmed || CognitoErrorCode.EmailNotVerified:
            await sleep(1000);
            navigate("/verify-email", {
              state: { email },
            });
            break;
          case CognitoErrorCode.UserNotFound:
            await sleep(1000);
            setMsg("Could not find the user. Do you want to register a new account?");
            navigate("/register");
            break;
          case CognitoErrorCode.NotAuthorized:
            setMsg("Incorrect username or password");
            break;
          default:
            setMsg("Fail to connect to server. Please try again.");
        }
      } else {
        setMsg("Unexpected error occurs during login");
      }
    }
  };

  return (
    <>
      <div className="login-container flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="login-box sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">🚀 Sign In </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm">
              <Link to="/reset-password" className="font-semibold font-medium !text-yellow-800 hover:text-yellow-500">
                Forgot password?
              </Link>
            </div>

            <p>{msg ? msg : ""}</p>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-black">
            Not a member?{" "}
            <Link to="/register" className="font-medium !text-yellow-800 dark:text-yellow-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
