import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, notifyBackendLogin, notifyBackendLogout } from "@/services/authentication";
import { CognitoAuthError } from "@/services/appExceptions";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { userPool } from "@/services/userpool";
import { LoginType } from "@/types/user";

interface ProviderProps {
  user: string | null;
  token: string;
  login(data: LoginType): void;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  user: null,
  token: "",
  login: () => {},
  logout: () => {},
});

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const [user, setUser] = useState<string | null>(storedInfo?.email);
  // const [message, setMessage] = useState<string>('')
  const [token, setToken] = useState(storedInfo?.token || "");
  const navigate = useNavigate();

  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [token]);

  useEffect(() => {
    const storedInfo = localStorage.getItem("user");
    const lastActiveTime = parseInt(localStorage.getItem("lastActiveTime") || "0", 10);
    const now = Date.now();
    const sessionTimeout = 5 * 60 * 1000; // 5 minutes

    if (storedInfo && now - lastActiveTime <= sessionTimeout) {
      const parsed = JSON.parse(storedInfo);
      setUser(parsed.email);
      setToken(parsed.token);

      console.log("stored user token:", token);
    } else {
      console.log("since the last active time is 5 mins. more, log out");
      logout();
    }
  }, [token]);

  useEffect(() => {
    const handleUnload = () => {
      const now = Date.now();
      localStorage.setItem("lastActiveTime", now.toString());
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [token]);

  const login = async (data: LoginType) => {
    try {
      const userData = {
        Username: data.email,
        Pool: userPool,
      };

      // localStorage.setItem("user", JSON.stringify({ email: data.email, token: token, userId }));
      localStorage.setItem("lastActiveTime", Date.now().toString());
      console.log("begin logging in");

      const cognitoUser = new CognitoUser(userData);
      const authenticationDetails = new AuthenticationDetails({
        Username: data.email,
        Password: data.password,
      });

      const CognitoUserSession = await authenticateUser(cognitoUser, authenticationDetails); // Authenticate the user

      const accessToken = CognitoUserSession.getIdToken().getJwtToken(); // Get the JWT Token from the result
      console.log("user accessToken:", accessToken);
      const userId = CognitoUserSession.getIdToken().payload.sub;

      setUser(userId);
      setToken(accessToken);
      localStorage.setItem("user", JSON.stringify({ email: data.email, token: accessToken, userId: userId }));
      await notifyBackendLogin(accessToken);

      console.log("login:", userId, accessToken);
      // navigate("/Home");
    } catch (error) {
      if (error instanceof CognitoAuthError) {
        throw error; // rethrow for UI to handle
      }
      console.error("Unknown login error:", error);
      throw new Error("Unexpected login failure");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("lastActiveTime");

    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
      await notifyBackendLogout(token);
      setUser(null);
      setToken("");
    } else {
      console.log("No user is currently signed in.");
    }
    navigate("/login");
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export { AuthContext };
