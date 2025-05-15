import React, { createContext, useState, useEffect } from "react";
import { RemindeeProfile } from "@/types/remindee";
import { UserProfile } from "@/types/user";
import { fetchRemindeeProfile, fetchUserProfile } from "../services/profile";
import { useAuth } from "../hooks/useAuth";

interface UserProfileContextType {
  userProfile: UserProfile | null;
  updateUserProfile: () => Promise<void>;
  isNewUser: boolean | null;
  isUserProfileComplete: boolean | null;
  loading: boolean;
  remindeeList: RemindeeProfile[] | null;
  loadMoreRemindees: (token: string) => Promise<void>;
  hasMore: boolean | false;
}
const LIMIT = 3;
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [remindeeList, setRemindeeList] = useState<RemindeeProfile[]>([]);
  // useState<RemindeeProfile[] | null>(null);
  // const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  // const [remindeeList, setRemindeeList] = useState<RemindeeProfile[]>([]);

  useEffect(() => {
    if (!token) {
      console.log("token is empty");
      setLoading(false);
      setRemindeeList([]);
      setSkip(0);
      setHasMore(true);
      return;
    }
    console.log("fetch user profile");
    fetchUserProfile(token)
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch(() => {
        setUserProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
    loadMoreRemindees(token);
  }, [token]);

  const loadMoreRemindees = async (token: string) => {
    if (hasMore) {
      setLoading(true);
      const response = await fetchRemindeeProfile(token, skip, LIMIT);
      setLoading(false);

      if (response.RemindeeList.length > 0) {
        if (skip == 0) setRemindeeList(response.RemindeeList); // handle refresh condition
        else setRemindeeList((prev) => [...prev, ...response.RemindeeList]); // append
        setHasMore(response.has_more);
        setSkip(skip + LIMIT);
      } else {
        setHasMore(false);
      }
    }
  };

  const updateUserProfile = async () => {
    const uptUserProfile = await fetchUserProfile(token);
    setUserProfile(uptUserProfile);
  };
  const isNewUser = remindeeList === null;
  const isUserProfileComplete = !userProfile?.user_summary || !userProfile?.avatar_url;
  // const isNewUser = true;

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        isNewUser,
        isUserProfileComplete,
        loading,
        remindeeList,
        loadMoreRemindees,
        hasMore,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export default UserProfileProvider;
export { UserProfileContext };
