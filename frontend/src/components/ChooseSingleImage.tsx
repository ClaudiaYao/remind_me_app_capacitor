import React, { useRef } from "react";
// import CustomFileInput from "./CustomFileInput";
type ChooseImageProps = {
  chosenImage: File | null;
  setChosenImage: React.Dispatch<React.SetStateAction<File | null>>;
};

// CarouselForm.tsx

export default function ChooseSingleImage({ chosenImage, setChosenImage }: ChooseImageProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setChosenImage(e.target.files[0]);
    }
  };

  const handleDeleteImage = () => {
    setChosenImage(null);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full justify-center mx-auto bg-white shadow rounded-xl space-y-6 px-4">
      {/* Centered Row with Vertical Alignment */}

      {/* Image Upload */}
      <div className="!w-full mx-auto bg-white shadow rounded-xl space-y-6">
        <div
          onClick={handleClick}
          className="cursor-pointer border-2 border-dashed border-gray-400 p-4 rounded text-center hover:bg-gray-100"
        >
          📁 Click to choose images ...
          <p className="text-sm text-gray-500">(Only one image file is allowed)</p>
        </div>
        <input type="file" ref={inputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>

      {/* Carousel */}
      {chosenImage && (
        <div className="relative w-full h-[32rem] flex flex-col items-center justify-between rounded-md overflow-hidden space-y-2">
          {/* Image */}
          <div className="relative h-[28rem] w-full flex items-center justify-center">
            <img src={URL.createObjectURL(chosenImage)} className="w-full h-full object-contain" />

            {/* Delete Button */}
            <button
              onClick={handleDeleteImage}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-700"
              title="Delete Image"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
