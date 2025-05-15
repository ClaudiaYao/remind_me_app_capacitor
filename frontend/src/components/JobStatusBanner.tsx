import React, { useEffect, useState } from "react";
import { useJob } from "@/hooks/useJob";
import { Loader2 } from "lucide-react";

const JobStatusBanner: React.FC = () => {
  const { jobId, jobStatus } = useJob();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (jobStatus === "Completed" || jobStatus === "Error") {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount or jobStatus change
    }
  }, [jobStatus]);

  if (!jobId || !jobStatus || !isVisible) return null;

  const isInProgress = jobStatus === "InProgress";
  const isCompleted = jobStatus === "Completed";

  const bgColor = isInProgress ? "bg-yellow-400" : isCompleted ? "bg-green-500" : "bg-red-400";

  const message = isInProgress
    ? "Processing your images... Please wait."
    : isCompleted
    ? "Job completed successfully!"
    : "Something went wrong with your job. Please try again.";

  if (jobStatus === "Logout") return null;

  return (
    <div className={`${bgColor} text-gray-600 py-2 px-4 text-center shadow-md`}>
      <div className="flex justify-center items-center gap-2">
        {isInProgress && <Loader2 className="animate-spin w-4 h-4" />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default JobStatusBanner;
