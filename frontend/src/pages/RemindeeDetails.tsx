import { useAuth } from "@/hooks/useAuth";
import { fetchRemindeeDetails, RemindeeInfoAll } from "@/services/profile";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RemindeeSingleRecord } from "@/types/remindee";
import Login from "@/components/Login";
import { RemindeeUpdate, RemindeeUpdatePayload, updateRemindeeDetails } from "@/services/profile";
import { Button } from "@/components/ui/button";
import PromptDialog from "@/components/PromptDialog";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

const RemindeeDetails: React.FC = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const person_name = searchParams.get("person_name");
  const [profileImageURL, setProfileImageURL] = useState<string>();
  const [relationship, setRelationship] = useState<string>();

  const [remindeeInfoAll, setRemindeeInfoAll] = useState<RemindeeInfoAll>();
  const [remindeeRecords, setRemindeeRecords] = useState<RemindeeSingleRecord[]>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [deletedItems, setDeletedItems] = useState<boolean[]>([]);
  const [updatedItems, setUpdatedItems] = useState<boolean[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { showPrompt, confirmLeave, cancelLeave } = useNavigationGuard(hasUnsavedChanges);
  if (!person_name) {
    throw new Error("Missing person_name in URL parameters");
  }

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchRemindeeDetails(token, person_name);
        console.log("response:", response);

        setRemindeeInfoAll(response);
        const relation = Array.from(new Set(response.records.map((item) => item.relationship))).join(", ");

        const random_record: RemindeeSingleRecord =
          response.records[Math.floor(Math.random() * response.records.length)];

        console.log(random_record.image_object_key);
        setProfileImageURL(response.image_presigned_url[random_record.image_object_key]);
        setRelationship(relation);

        setRemindeeRecords(response.records);
        if (response) {
          setDeletedItems(new Array(response.records.length).fill(false));
          setUpdatedItems(new Array(response.records.length).fill(false));
        }
        setHasUnsavedChanges(false);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch remindee details:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleDelete = (index: number) => {
    const deleted = [...deletedItems];
    deleted[index] = !deleted[index];
    setDeletedItems(deleted);
    setHasUnsavedChanges(deletedItems.every((item) => item === false));
  };

  const handleUpdate = (value: string, index: number) => {
    if (remindeeRecords) {
      const records = [...remindeeRecords];
      records[index].summary = value;
      setRemindeeRecords(records);
      console.log("hpdated summay:", remindeeRecords[index].summary);
    }

    const updated = [...updatedItems];
    updated[index] = true;
    setUpdatedItems(updated);
    setHasUnsavedChanges(true);
  };

  const handleSubmitChange = async () => {
    const allUpdateRecords = [];
    console.log(deletedItems);
    console.log(updatedItems);

    if (remindeeRecords) {
      for (let i = 0; i < deletedItems.length; i++) {
        const item = deletedItems[i];
        if (item === true) {
          const record: RemindeeUpdate = {
            image_object_url: remindeeRecords[i].image_object_key,
            image_summary: remindeeRecords[i].summary,
            action: "delete",
          };
          allUpdateRecords.push(record);
        }
      }

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        console.log(item, deletedItems[0]);
        if (item === true && deletedItems[i] === false) {
          const record: RemindeeUpdate = {
            image_object_url: remindeeRecords[i].image_object_key,
            image_summary: remindeeRecords[i].summary,
            action: "update",
          };
          console.log("updated record:", record);
          allUpdateRecords.push(record);
        }
      }

      const updatePayload: RemindeeUpdatePayload = {
        person_name: person_name,
        items: allUpdateRecords,
      };
      const response = await updateRemindeeDetails(updatePayload, token);
      if (response.success === true) {
        setMsg("Remindee infor has been updated.");
      }

      const leftRecords = remindeeRecords.filter((_, index) => deletedItems[index] === false);
      setRemindeeRecords(leftRecords);

      setDeletedItems(new Array(remindeeRecords.length).fill(false));
      setUpdatedItems(new Array(remindeeRecords.length).fill(false));
      setHasUnsavedChanges(false);
    }
  };

  if (!user) {
    // if current user is Null, then jump to Login component
    return <Login />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading remindee details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!remindeeInfoAll) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Fail to load the remindee information.</p>
      </div>
    );
  }

  console.log("remindee_info:", remindeeInfoAll.records[0].image_object_key);

  return (
    <div className="flex flex-col md:flex-row h-full p-4 space-y-4 md:space-y-0 md:space-x-6">
      {/* Left Pane */}
      <div className="w-full md:w-1/4 bg-white shadow rounded-xl p-4 flex flex-col items-center">
        <img src={profileImageURL} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
        <h2 className="mt-4 text-xl font-bold">{person_name}</h2>
        <p className="text-gray-500">{relationship}</p>
      </div>

      {/* Right Pane */}
      <div className="w-full md:w-3/4 bg-white shadow rounded-xl p-4 space-y-6">
        {/* Summary */}
        <div>
          <h3 className="!text-3xl font-semibold text-gray-700">✨ AI Assistant's Summary ✨</h3>
          <br></br>
          <p className="mt-2 text-gray-700 !text-left">{remindeeInfoAll?.ai_summary}</p>
        </div>
        <br />
        <h2 className="mt-4 text-xl font-bold !text-left">Images of {person_name}</h2>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {msg && <p className="font-medium !text-yellow-800 dark:text-yellow-500">{msg}</p>}
        </div>

        <Button
          onClick={handleSubmitChange}
          disabled={updatedItems.every((item) => item === false) && deletedItems.every((item) => item === false)}
          className="mt-2 px-3 py-1 bg-blue-50 text-white rounded-md hover:bg-blue-100 transition-colors duration-200 inline-flex items-center text-sm"
        >
          {" "}
          Submit Change of Remindee Information
        </Button>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remindeeRecords?.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-4 flex flex-col space-y-2">
              <img
                src={remindeeInfoAll?.image_presigned_url?.[item.image_object_key]}
                alt={`Card image ${index}`}
                className={`w-full h-40 object-cover rounded-lg ${deletedItems[index] ? "opacity-60" : ""}`}
              />

              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Image Summary:
              </label>
              <input
                value={item.summary}
                onChange={(e) => handleUpdate(e.target.value, index)}
                className={`border-1 border-gray-100 rounded px-2 ${deletedItems[index] ? "opacity-50 grayscale" : ""}`}
                // disabled={deletedItems[index]}
              />

              <div className="mt-2 flex justify-end space-x-2">
                {/* <button
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  onClick={() => handleUpdate(index)}
                >
                  {editingItems[index] ? "Undo Update" : "Update"}
                </button> */}

                <button
                  className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
                  onClick={() => handleDelete(index)}
                >
                  {deletedItems[index] ? "Undo Delete" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPrompt && (
        <PromptDialog
          open={showPrompt}
          onConfirm={confirmLeave}
          onCancel={cancelLeave}
          message="You have unsaved changes for the remindee. Proceed to leave the page?"
        />
      )}
    </div>
  );
};

export default RemindeeDetails;
