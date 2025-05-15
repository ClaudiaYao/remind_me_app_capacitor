// JobContext.tsx
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { isTrainingComplete } from "@/services/upload_train";
import { useAuth } from "@/hooks/useAuth";

type JobStatus = "InProgress" | "Completed" | "Error" | null | "Logout";

export interface JobContextType {
  jobId: string | null;
  setJobId: (id: string) => void;
  jobStatus: JobStatus;
  resetJobStatus: () => Promise<void>;
  checkJobStatus: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>(null);
  const { token } = useAuth();

  // Refs to hold latest values
  const jobIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    jobIdRef.current = jobId;
  }, [jobId]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const resetJobStatus = async () => {
    setJobStatus(null);
  };

  const checkJobStatus = useCallback(async () => {
    const currentJobId = jobIdRef.current;
    const currentToken = tokenRef.current;

    if (!currentJobId || !currentToken) return;

    try {
      const status = await isTrainingComplete(currentToken, currentJobId);
      if (status) {
        setJobStatus("Completed");
      } else {
        setJobStatus("InProgress");
      }
    } catch (error) {
      console.error("Error checking job status", error);
      setJobStatus("Error");
    }
  }, []);

  useEffect(() => {
    if (!jobId || !token) {
      setJobStatus(token ? null : "Logout");
      setJobId(null);
      return;
    }

    setJobStatus("InProgress");
    checkJobStatus(); // Run immediately

    const interval = setInterval(() => {
      checkJobStatus();
    }, 6000);

    return () => clearInterval(interval);
  }, [jobId, token, checkJobStatus]);

  return (
    <JobContext.Provider value={{ jobId, setJobId, jobStatus, resetJobStatus, checkJobStatus }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
export { JobContext };

//   const checkJobStatus = useCallback(async () => {
//     if (!jobId) return;
//     if (!token) return;

//     try {
//       const status = await isTrainingComplete(token, jobId);

//       if (status) {
//         setJobStatus("Completed");
//       } else {
//         setJobStatus("InProgress");
//       }
//     } catch (error) {
//       console.error("Error checking job status", error);
//       setJobStatus("Error");
//     }
//   }, [jobId, token]);

//   useEffect(() => {
//     if (!jobId) return;
//     if (!token) {
//       setJobStatus("Logout");
//       setJobId(null);
//       return;
//     }
//     // this is the method to check job status with an interval
//     setJobStatus("InProgress");
//     const interval = setInterval(() => {
//       checkJobStatus();
//     }, 6000);

//     return () => clearInterval(interval);
//   }, [jobId, token, checkJobStatus]);

//   return <JobContext.Provider value={{ jobId, setJobId, jobStatus, checkJobStatus }}>{children}</JobContext.Provider>;
// };

// export default JobProvider;
// export { JobContext };

// // export const useJob = () => {
// //   const context = useContext(JobContext);
// //   if (!context) throw new Error("useJob must be used within a JobProvider");
// //   return context;
// // };
