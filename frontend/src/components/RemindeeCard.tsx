import React from "react";
import { RemindeeProfile } from "@/types/remindee";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface PersonCardProps {
  person: RemindeeProfile;
  index: number;
}

const RemindeeCard: React.FC<PersonCardProps> = ({ person }) => {
  const navigate = useNavigate();
  // const [expanded, setExpanded] = useState(false);

  // const toggleExpand = () => {
  //   setExpanded((prev) => !prev);
  // };

  const handleMoreInfoClick = () => {
    navigate(`/remindee-details?person_name=${person.person_name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={person.image_object_key}
            alt={person.person_name}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{person.person_name}</h3>
          <p className="text-gray-600 leading-relaxed">{person.ai_summary}</p>
          <div className="space-y-2 text-left">
            <div>
              <span className="font-medium text-gray-700">Relationship:</span>{" "}
              <span className="text-gray-600">{person.relationship}</span>
            </div>
          </div>

          <Button
            onClick={handleMoreInfoClick}
            className="mt-2 px-3 py-1 bg-blue-50 text-white rounded-md hover:bg-blue-100 transition-colors duration-200 inline-flex items-center text-sm"
          >
            <span>{"Show More"}</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </Button>
        </div>
      </div>

      {/* {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left"></div>
          </div>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default RemindeeCard;
