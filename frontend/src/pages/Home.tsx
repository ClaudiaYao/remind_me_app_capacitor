// each page is represented by one .tsx

import React from "react";
import { useAuth } from "@/hooks/useAuth";
// import { fetchProfile, Profile } from "../services/fetch-profile";
import { useUserProfile } from "@/hooks/useUserProfile";
import Login from "@/components/Login";
import RemindeeCard from "@/components/RemindeeCard";
import "@/assets/styles/Button.css";
import { Link } from "react-router-dom";
import Instruction from "./Instruction";

const Home: React.FC = () => {
  const { user, token } = useAuth();
  console.log("user:", user);
  const { userProfile, isNewUser, loading, remindeeList, loadMoreRemindees, hasMore } = useUserProfile();

  console.log("usre info:", user);
  if (!user) {
    // if current user is Null, then jump to Login component
    return <Login />;
  }

  if (isNewUser) {
    return <Instruction />;
  }

  const handleLoadMore = async () => {
    console.log("has_more", hasMore);
    if (!token) return;
    await loadMoreRemindees(token);
  };

  // here, the UI is too ugly
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-6">
          <Link to="/profile" className="!text-gray-800">
            Welcome, {userProfile?.user_summary.nick_name || "User"}!
          </Link>
        </h1>
      </div>
      <h2 className="text-xl font-semibold text-gray-500 mb-4">👭🏼👫🏼 People You Know 🧑🏽‍🤝‍🧑🏽👬🏽 </h2>

      <div className="space-y-6">
        {remindeeList?.map((person, index) => (
          <RemindeeCard key={index} person={person} index={index} />
        ))}
      </div>

      {hasMore ? (
        <div style={{ marginTop: "1rem" }}>
          <span
            onClick={handleLoadMore}
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {loading ? "Loading..." : "Load More..."}
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-3xl font-medium text-gray-500"> </p>
          <p className="mt-10 text-center text-sm/6 text-black">
            No more remindees.{" "}
            <Link to="/upload" className="font-medium !text-yellow-800 dark:text-yellow-500 hover:underline">
              Add more?
            </Link>
          </p>
        </div>
      )}

      {/* {hasMore && (
        <button onClick={handleLoadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )} */}

      {(!remindeeList || remindeeList.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No people added yet. Add someone to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
