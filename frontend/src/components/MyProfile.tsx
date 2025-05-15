import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateProfile } from "@/services/profile";
import { UserSummary } from "@/types/user";

interface ProfileFormProps {
  // isEditing?: boolean;
  onClose?: () => void;
}

// Create a default user summary to use when userProfile is null
const defaultUserSummary: UserSummary = {
  nick_name: "",
  age: 0,
  description: "",
  phone_number: "",
};

const MyProfile: React.FC<ProfileFormProps> = ({ onClose }) => {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { token } = useAuth();
  const [updatedUserSummary, setUpdatedUserSummary] = useState<UserSummary>(
    userProfile?.user_summary || defaultUserSummary
  );
  const [preview, setPreview] = useState<string | undefined>(userProfile?.avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Update state when userProfile changes
  useEffect(() => {
    if (userProfile?.user_summary) {
      // Use structuredClone for deep copying if available, otherwise create a new object
      setUpdatedUserSummary(
        typeof structuredClone !== "undefined"
          ? structuredClone(userProfile.user_summary)
          : { ...userProfile.user_summary }
      );
      setPreview(userProfile.avatar_url);
    } else {
      // Initialize with default values if userProfile is null
      setUpdatedUserSummary(defaultUserSummary);
    }
  }, [userProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setIsDisabled(false);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setUpdatedUserProfile((prevProfile) => ({
  //     ...prevProfile,
  //     [name]: value,
  //   }));
  // };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserSummary((existingProfile) => ({
      ...existingProfile,
      [name]: name === "age" ? Number(value) : value,
    }));
    setIsDisabled(false);
  };

  const handleSave = async () => {
    if (!token) {
      setErrorMessage("You must be logged in to update your profile.");
      return;
    }

    try {
      setIsSaving(true);

      await updateProfile(token, updatedUserSummary, selectedFile);
      await updateUserProfile();
      console.log("updated user profile:", updatedUserSummary);

      if (onClose) {
        onClose();
      } else {
        // window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again later.");
    } finally {
      setIsDisabled(true);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values or defaults
    setUpdatedUserSummary(
      userProfile?.user_summary
        ? typeof structuredClone !== "undefined"
          ? structuredClone(userProfile.user_summary)
          : { ...userProfile.user_summary }
        : defaultUserSummary
    );
    setPreview(userProfile?.avatar_url);
    setIsDisabled(false);
    setIsSaving(false);
    setSelectedFile(null);
    setErrorMessage(null);
    onClose?.();
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md min-w-[375px] min-h-[700px] text-black">
      <h2 className="text-3xl font-bold p-1">My Profile</h2>

      <div className="space-y-4">
        <div>
          <div className="relative w-32 h-32 group">
            <img
              src={preview || "/profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 bg-gray-400 bg-opacity-50 w-24 h-24 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-sm font-semibold text-white">Edit</span>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-4">Nickname:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            value={updatedUserSummary.nick_name || ""}
            onChange={handleChange}
            name="nick_name"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Age:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            value={updatedUserSummary.age || ""}
            onChange={handleChange}
            name="age"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Description:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            value={updatedUserSummary.description || ""}
            onChange={handleChange}
            name="description"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Phone Number:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            value={updatedUserSummary.phone_number || ""}
            onChange={handleChange}
            name="phone_number"
          />

          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            disabled={isDisabled}
            onClick={handleCancel}
            className={isDisabled ? `bg-gray-400 cursor-not-allowed` : `bg-blue-500 hover:bg-blue-600`}
          >
            Cancel
          </button>
          <button
            disabled={isDisabled}
            onClick={handleSave}
            className={isDisabled ? `bg-gray-400 cursor-not-allowed` : `bg-blue-500 hover:bg-blue-600`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
