// Upload.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { trigger_train } from "@/services/upload_train";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJob";

const TrainModel: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [infoMsg, setInfoMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isModelUpdated, setIsModelUpdated] = useState<boolean>(false);

  const { setJobId } = useJob();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleTrain = async () => {
    try {
      const jobId = await trigger_train(token);
      console.log(jobId);
      setJobId(jobId);
      setInfoMsg("Your AI Assistant has finished training. Now you could begin identifying your remindees.");
      setErrorMsg("");
      setIsModelUpdated(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("An error has occurred. Please try again later.");
      setIsModelUpdated(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">🤖 Train your AI Assistant 🤖</h1>
      </div>
      <h2 className="text-xl font-semibold text-gray-500 mb-4">
        Train your AI Assistant, so that it could identify your remindees more accurately...
      </h2>

      {errorMsg && <h2 className="text-red-500">{errorMsg}</h2>}

      {infoMsg && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-green-600 font-bold text-l">{infoMsg}</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="flex w-64 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          disabled={isModelUpdated}
          onClick={handleTrain}
        >
          Train Your AI Assistant
        </button>
      </div>
    </div>
  );
};

export default TrainModel;
