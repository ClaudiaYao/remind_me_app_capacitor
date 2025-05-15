import { useState } from "react";
import { userPool } from "../services/userpool";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate, Link } from "react-router-dom";
import "@/assets/styles/Authentication.css";
import "@/assets/styles/Button.css";

const PasswordResetComponent = () => {
  const [step, setStep] = useState(1); // Step 1: Request Reset, Step 2: Confirm New Password
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); // For navigation

  // Step 1: Request password reset (Cognito sends email)
  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!email) {
      setMsg("Email is required.");
      return;
    }
    const user = new CognitoUser({ Username: email, Pool: userPool });
    if (step === 1) {
      user.forgotPassword({
        onSuccess: () => {
          setMsg("Verification code sent to email.");
          setStep(2); // Move to the next step
        },
        onFailure: () => {
          setMsg("Enter a valid email address.");
        },
      });
    }
    // Step 2: Confirm new password with verification code
    if (step === 2) {
      if (!code || !newPassword) {
        setMsg("Code and new password are required.");
        return;
      }
      const confirmPasswordReset = async () => {
        const user = new CognitoUser({ Username: email, Pool: userPool });

        user.confirmPassword(code, newPassword, {
          onSuccess: () => {
            setMsg("Password reset successful. You can now log in.");
            // setStep(1); // Reset back to step 1
            setTimeout(() => {
              navigate("/login"); // Change to the desired page
            }, 4000);
          },
          onFailure: () => {
            setMsg("Invalid code or password.");
          },
        });
      };
      await confirmPasswordReset();
    }
  };

  return (
    <div className="login-container flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="login-box sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">🚀 Reset Password </h2>
        <br></br>
        <form>
          {step === 1 ? (
            <div className="form-group">
              {/* <input
                type="email"
                placeholder="Enter your email"
                value={email}
                className="input-field"
                onChange={(e) => setEmail(e.target.value)}
              /> */}

              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address:
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

              <p className="login-error">{msg ? msg : ""}</p>

              <div className="buttons-default">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                  onClick={requestPasswordReset}
                >
                  Send Reset Email
                </button>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
                onChange={(e) => setCode(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <br />
              <p className="login-error">{msg ? msg : ""}</p>
              <div className="buttons-default">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                  onClick={requestPasswordReset}
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </form>
        <div className="mt-10 text-center text-sm/6 text-black">
          <Link to="/" className="font-medium !text-yellow-800 dark:text-yellow-500 hover:underline">
            Back to login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetComponent;
