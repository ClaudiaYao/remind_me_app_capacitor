import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJob";

import { trigger_train } from "@/services/upload_train";

const TrainAiModel = () => {
  const { token } = useAuth();
  const [isTraining, setIsTraining] = useState(false);
  const { jobStatus, setJobId, resetJobStatus } = useJob();
  const [msg, setMsg] = useState("");

  const handleTraining = async () => {
    try {
      // clear the previous job status
      resetJobStatus();
      const jobId = await trigger_train(token);
      console.log(jobId);
      setIsTraining(true);
      setJobId(jobId);
    } catch (error) {
      console.error(error);
      setMsg("An error has occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (jobStatus === "Completed") {
      setIsTraining(false);
      setMsg("Your AI assistant has finished training. You could use it to identify the persons.");
    } else if (jobStatus === "Error") {
      setIsTraining(false);
      setMsg("Training encounters some error. Please try again.");
    }
  }, [jobStatus]);

  return (
    <>
      <div>
        <p>You have not trained your AI assistant. </p>
        <button onClick={handleTraining} disabled={isTraining}>
          {isTraining ? "Training..." : "Train Your AI Assistant Now"}
        </button>
        <p className="text-gray-500">{msg}</p>
      </div>
    </>
  );
};

export default TrainAiModel;
