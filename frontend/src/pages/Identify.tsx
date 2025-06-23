import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { identify, IdentifyResponse, RemindeeInfo } from "@/services/identify";
import TrainAiModel from "@/components/TrainAiModel";
import { check_model_exist } from "@/services/upload_train";
import ChooseSingleImage from "@/components/ChooseSingleImage";
// import { Button } from "@/components/ui/button";
import Instruction from "./Instruction";

const Identify: React.FC = () => {
  const { token, user } = useAuth();
  const { isNewUser } = useUserProfile();
  const navigate = useNavigate();

  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [identifiedPerson, setIdentifiedPerson] = useState<RemindeeInfo | null>(null);
  const [isModelExist, setIsModelExist] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);
  // const [identifyJobId, setIdentifyJobId] = useState<string | null>(null);
  const [chosenImage, setChosenImage] = useState<File | null>(null);

  useEffect(() => {
    if (!chosenImage) {
      setIdentifiedPerson(null);
    }
  }, [chosenImage]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    const fetchModelStatus = async () => {
      try {
        const model_exist = await check_model_exist(token);
        setIsModelExist(model_exist);
      } catch (error) {
        console.error("Error checking model existence:", error);
      }
    };

    fetchModelStatus();
  }, [user, token, navigate]);

  if (isNewUser) {
    return <Instruction />;
  }

  const handleImageSubmit = async () => {
    try {
      if (chosenImage) {
        const response: IdentifyResponse = await identify(token, chosenImage);
        if (response.data) {
          if (response.data.person == "NA") setIdentifiedPerson(null);
          else setIdentifiedPerson(response.data);
        } else {
          setIdentifiedPerson(null);
        }
        setMsg(null);
      }
    } catch (error) {
      console.error(error);
      setMsg("There was a problem identifying the image. Please try again.");
    }
  };

  // <div className="container mx-auto p-4 pt-20">
  //     <div className="flex justify-center items-center mb-6">
  //       <h1 className="text-2xl font-bold">Upload Images</h1>
  //     </div>
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
          Do You Know this Person? 🔎
        </h1>
      </div>

      {!isModelExist && <TrainAiModel />}

      {isModelExist && (
        <>
          <h2 className="text-xl font-semibold text-gray-500 mb-4">Ask AI assistant 🤖 to help you identify... </h2>

          {/* <form onSubmit={handleImageSubmit} className="space-y-6 text-black  rounded-xl"> */}

          {<ChooseSingleImage chosenImage={chosenImage} setChosenImage={setChosenImage} />}

          <div className="flex justify-center mt-6">
            <button
              className="flex w-64 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              disabled={!chosenImage}
              onClick={handleImageSubmit}
            >
              Identify This Person
            </button>
          </div>

          <br></br>
          {msg && <p className="font-medium !text-yellow-800 dark:text-yellow-500">{msg}</p>}

          {identifiedPerson?.image ? (
            <div>
              <h2 className="text-3xl font-bold">This person is:</h2>
              <div
                style={{
                  marginBottom: "20px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={identifiedPerson?.image}
                  alt={identifiedPerson?.person}
                  width={300}
                  height={300}
                  style={{ borderRadius: "50%", marginRight: "20px" }}
                />
                <div>
                  <h3 className="text-2xl font-bold">{identifiedPerson?.person}</h3>
                  <p>{identifiedPerson?.summary}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-3xl font-bold">{identifiedPerson?.person}</h3>
              <p className="text-2xl font-semibold">{identifiedPerson?.summary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Identify;
