import { useState } from "react";

const Instruction: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["intro_1.jpg", "intro_2.jpg"];

  return (
    <div className="intro-container flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl font-bold">Welcome to RemindMe</h1>
      </div>

      <div className="w-full flex flex-col items-center justify-between rounded-md overflow-hidden space-y-2">
        {/* Image container */}
        <div className="relative w-full flex items-center justify-center bg-gray-100">
          <img src={"/" + images[currentIndex]} alt={`Step ${currentIndex}`} className="w-full h-full object-contain" />
        </div>

        {/* Indicator BELOW the image */}
        <div className="flex gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`!w-2 !h-2 !bg-gray-100 !rounded-full hover:bg-gray-300 focus:outline-none ${
                i === currentIndex ? "!bg-gray-400" : "!bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instruction;
