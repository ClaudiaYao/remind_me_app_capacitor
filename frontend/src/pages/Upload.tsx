// Upload.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import UploadBox from "@/components/UploadRemindeeInfoBox";
import { UploadPayload, trigger_train, upload as uploadImage } from "@/services/upload_train";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJob";
import { RemindeeProfile } from "@/types/remindee";
import RemindeeCard from "@/components/RemindeeCard";

const Upload: React.FC = () => {
  const [uploadData, setUploadData] = useState<UploadPayload>({
    person_name: "",
    relationship: "",
    files: [],
    summary: [],
  });
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [infoMsg, setInfoMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [uploadedRemindee, setUploadedRemindee] = useState<RemindeeProfile>();
  const { setJobId } = useJob();
  const [isTrainDisbled, setIsTrainDisabled] = useState<boolean>(true);
  const [uploadDisabled, setUploadDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log(uploadData.files.length, uploadData.person_name, uploadData.relationship);
    if (uploadData.files.length > 0 && uploadData.person_name != "" && uploadData.relationship != "") {
      setUploadDisabled(false);
    } else setUploadDisabled(true);
  }, [uploadData]);

  const handleTrain = async () => {
    try {
      const jobId = await trigger_train(token);
      setUploadDisabled(false);
      console.log(jobId);
      setJobId(jobId);
      setInfoMsg("Your AI Assistant has finished training. Now you could begin identifying your remindees.");
      setErrorMsg("");
      setIsTrainDisabled(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("An error has occurred. Please try again later.");
      setIsTrainDisabled(false);
    }
  };

  const handleBoxSubmit = async () => {
    // this is the key, just ensure it meets the API endpoint requirement
    if (uploadData.files) {
      const upload_payload = uploadData as UploadPayload;
      console.log(uploadData);
      try {
        const remindee_profile = await uploadImage(upload_payload, token, (progress) => {
          console.log(progress);
          setInfoMsg(`Uploading images... ${progress}%`);
        });

        setInfoMsg(`Successfully uploaded images!`);
        setErrorMsg("");

        setUploadedRemindee(remindee_profile);
        setUploadData({ person_name: "", relationship: "", summary: [], files: [] });
        setIsTrainDisabled(false);
        setUploadDisabled(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("nothing uploaded");
    }
  };

  console.log(uploadDisabled);
  return (
    <div className="p-6 bg-white shadow-md rounded-md min-w-[375px] min-h-[700px] text-black">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-xl font-bold">Upload Remindee's Images 👩‍🔧</h1>
      </div>
      {uploadedRemindee && <RemindeeCard key={0} person={uploadedRemindee} index={0} />}

      {errorMsg && <h2 className="text-red-500">{errorMsg}</h2>}
      {infoMsg && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{infoMsg}</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <UploadBox uploadPayload={uploadData} setUploadPayload={setUploadData} />
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="flex w-64 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          disabled={uploadDisabled}
          onClick={handleBoxSubmit}
        >
          Upload Images
        </button>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="flex w-64 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          disabled={isTrainDisbled}
          onClick={handleTrain}
        >
          Train Your AI Assistant
        </button>
      </div>
    </div>
  );
};

export default Upload;
