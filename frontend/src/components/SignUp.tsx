import { useState } from "react";
import { userPool } from "../services/userpool";
import { useNavigate, Link } from "react-router-dom";
import "@/assets/styles/Authentication.css";
import "@/assets/styles/Button.css";

const SignUpComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleSignUp = () => {
    try {
      console.log("enter sign up handling");
      new Promise((resolve, reject) => {
        // setMessage("just for test");
        userPool.signUp(email, password, [], [], (err, data) => {
          if (err) {
            reject(err);
            console.error(err);
            setMsg(err.message);
            return;
          } else {
            resolve(data);

            setMsg("Sign-up successful. Please check your email for the verification code.");
            setTimeout(() => {
              navigate("/verify-email", { state: { email } }); // Change to the desired page
            }, 3000);
            // navigate("/verify-email", { state: { email } });
          }
        });
      });
    } catch (err) {
      if (err instanceof Error) {
        // setMessage(err.message);
        console.log("generate error:", err.message);
        setMsg(err.message);
      }
    }
  };

  // Prevent form submission from reloading the page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (!email || !password) {
      setMsg("Both fields are required.");
      return;
    }
    handleSignUp();
  };

  return (
    // <div className="App">
    <div className="login-container flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="login-box sm:mx-auto sm:w-full sm:max-w-sm">
        <form>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">🚀 Sign Up </h2>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>{msg}</p>
          <p>{msg ? msg : ""}</p>
          <div>
            <p className="mt-10 text-center text-sm/6 text-black">
              Already a member? <Link to="/login">Sign in!</Link>
            </p>
          </div>

          <div className="buttons-default">
            <button type="submit" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpComponent;
