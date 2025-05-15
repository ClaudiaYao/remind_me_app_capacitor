import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Trash2, Upload } from "lucide-react";

// Interface for each uploaded image item
interface ImageItem {
  id: string; // Unique identifier for the image
  file: File; // The actual file object
  preview: string; // URL for preview display
  description: string; // Optional description text
}

// Props interface with configuration options
interface UploadBoxProps {
  id: string; // Unique identifier for this upload box
  removable?: boolean;
  onRemove?: (id: string) => void; // Function to call when removing this box
  title?: string; // Custom title for the box (optional)
  showDescriptionFields?: boolean; // Whether to show description inputs (default: true)
  showName?: boolean; // Whether to show the name field (default: true)
  nameLabel?: string; // Custom label for the name field (optional)
  namePlaceholder?: string; // Custom placeholder for name input (optional)
  relationship?: string;
  relationshipLabel?: string;
  relationshipPlaceholder?: string;
  descriptionPlaceholder?: string; // Custom placeholder for description inputs (optional)
  uploadLabel?: string; // Custom label for the upload area (optional)
  singleImageMode?: boolean; // Whether to allow only one image (default: false)
  singleImageHeight?: string; // Height for single image preview (default: "h-48")
  onChange?: (data: {
    // Callback when data changes (optional)
    id: string;
    name: string;
    relationship: string;
    images: ImageItem[];
  }) => void;
  showButton?: boolean; // Whether to show the button (default: false)
  buttonText?: string; // Custom text for the button (optional)
  buttonType?: "button" | "submit" | "reset"; // HTML button type (default: "button")
  onButtonClick?: () => void; // Function to call when the button is clicked
}

/**
 * UploadBox - A reusable component for uploading and managing images
 *
 * This component provides a card-based interface for uploading images,
 * with options for single or multiple images, name input, and descriptions.
 */

// export function CarouselForm() {
//   const [formData, setFormData] = useState({
//     person_name: "",
//     relationship: "",
//     image_summary: "",
//   });
//   const [images, setImages] = useState<File[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(Array.from(e.target.files));
//       setCurrentIndex(0); // reset to first image
//     }
//   };

//   const showPrev = () => {
//     setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const showNext = () => {
//     setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl space-y-6">
//       {/* Text Inputs */}

//       <div key={formData.person_name}>
//         <label className="block text-sm font-medium text-gray-700 capitalize">Remindee Name:</label>
//         <input
//           type="text"
//           name={"person_name"}
//           value={formData.person_name}
//           onChange={handleInputChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
//         />
//       </div>

//       <div key={formData.relationship}>
//         <label className="block text-sm font-medium text-gray-700 capitalize">Remindee Name:</label>
//         <input
//           type="text"
//           name={"person_name"}
//           value={formData.relationship}
//           onChange={handleInputChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
//         />
//       </div>

//       {/* Image Upload */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Upload Remindee Images</label>
//         <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-1 block" />
//       </div>

//       {/* Carousel */}
//       {images.length > 0 && (
//         <div className="relative w-full h-64 flex items-center justify-center border rounded-md overflow-hidden">
//           <img
//             src={URL.createObjectURL(images[currentIndex])}
//             alt={`Uploaded ${currentIndex}`}
//             className="object-contain h-full"
//           />
//           <button
//             onClick={showPrev}
//             className="absolute left-2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow"
//           >
//             ◀
//           </button>
//           <button
//             onClick={showNext}
//             className="absolute right-2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow"
//           >
//             ▶
//           </button>
//         </div>
//       )}

//       <div key={formData.image_summary}>
//         <label className="block text-sm font-medium text-gray-700 capitalize">Comment for the Images:</label>
//         <input
//           type="text"
//           name={"person_name"}
//           value={formData.image_summary}
//           onChange={handleInputChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
//         />
//       </div>
//     </div>
//   );
// }

// export default CarouselForm;

// const UploadBox: React.FC<UploadBoxProps> = ({
//   id,
//   removable = true,
//   onRemove,
//   title = "Person Details",
//   showDescriptionFields = true,
//   showName = true,
//   nameLabel = "Name",
//   relationshipLabel = "Relationship",
//   namePlaceholder = "Enter person's name",
//   relationshipPlaceholder = "Enter relationship",
//   descriptionPlaceholder = "Enter description",
//   uploadLabel = "Drag & drop images here, or click to select files",
//   singleImageMode = false,
//   singleImageHeight = "h-48",
//   onChange,
//   showButton = false,
//   buttonText = "Additional Action",
//   buttonType = "button",
//   onButtonClick,
// }) => {
//   // State for the person's name
//   const [name, setName] = useState<string>("");

//   // State for the person's relationship
//   const [relationship, setRelationship] = useState<string>("");

//   // State to track all uploaded images
//   const [images, setImages] = useState<ImageItem[]>([]);

//   // Clean up object URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       // Revoke all object URLs to prevent memory leaks
//       images.forEach((img) => URL.revokeObjectURL(img.preview));
//     };
//   }, [images]);

//   // Notify parent component when data changes
//   const notifyChange = (updatedName?: string, updatedRelationship?: string, updatedImages?: ImageItem[]) => {
//     if (onChange) {
//       onChange({
//         id,
//         name: updatedName !== undefined ? updatedName : name,
//         relationship: updatedRelationship !== undefined ? updatedRelationship : relationship,
//         images: updatedImages !== undefined ? updatedImages : images,
//       });
//     }
//   };

//   // Handle file input change when user selects files
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       // Convert FileList to array
//       const fileArray = Array.from(event.target.files);

//       // For single image mode, we only take the first selected image
//       const filesToProcess = singleImageMode ? [fileArray[0]] : fileArray;

//       const newImages = filesToProcess.map((file) => ({
//         id: URL.createObjectURL(file), // Create a unique ID using object URL
//         file,
//         preview: URL.createObjectURL(file), // Create preview URL
//         description: "",
//       }));

//       // In single image mode, replace existing image
//       // In multiple image mode, add to existing images
//       const updatedImages = singleImageMode ? newImages : [...images, ...newImages];

//       setImages(updatedImages);
//       notifyChange(undefined, undefined, updatedImages);
//     }
//   };

//   // Update the description for a specific image
//   const handleDescriptionChange = (imageId: string, value: string) => {
//     const updatedImages = images.map((img) => (img.id === imageId ? { ...img, description: value } : img));
//     setImages(updatedImages);
//     notifyChange(undefined, undefined, updatedImages);
//   };

//   // Remove a specific image
//   const handleRemoveImage = (imageId: string) => {
//     // Revoke the object URL to prevent memory leaks
//     const imgToRemove = images.find((img) => img.id === imageId);
//     if (imgToRemove) {
//       URL.revokeObjectURL(imgToRemove.preview);
//     }

//     const updatedImages = images.filter((img) => img.id !== imageId);
//     setImages(updatedImages);
//     notifyChange(undefined, undefined, updatedImages);
//   };

//   // Handle name input change
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setName(e.target.value);
//     notifyChange(e.target.value, undefined, undefined);
//   };

//   // Handle relationship input change
//   const handleRelationshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRelationship(e.target.value);
//     notifyChange(undefined, e.target.value, undefined);
//   };

//   // Different rendering for single image mode vs multiple image mode
//   const renderImageUpload = () => {
//     if (singleImageMode) {
//       // Single image upload mode
//       return (
//         <div className="mb-4">
//           <label className="block mb-2 font-medium">{images.length === 0 ? "Upload Image" : "Image"}</label>

//           {images.length === 0 ? (
//             // Show upload button when no image is selected
//             <div
//               className="cursor-pointer p-6 text-center border border-dashed border-gray-400 rounded-lg hover:bg-gray-100"
//               onDrop={(e) => {
//                 e.preventDefault();
//                 handleFileChange({
//                   target: { files: e.dataTransfer.files },
//                 } as React.ChangeEvent<HTMLInputElement>);
//               }}
//               onDragOver={(e) => e.preventDefault()}
//             >
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id={`file-input-${id}`}
//               />
//               <label
//                 htmlFor={`file-input-${id}`}
//                 className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2"
//               >
//                 <Upload className="w-8 h-8 text-gray-500" />
//                 <span>{uploadLabel}</span>
//               </label>
//             </div>
//           ) : (
//             // Show the uploaded image with option to replace
//             <div className="relative border rounded-lg overflow-hidden">
//               <img
//                 src={images[0].preview}
//                 alt="uploaded preview"
//                 className={`w-full ${singleImageHeight} object-cover`}
//               />

//               <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
//                 <div className="flex gap-2">
//                   {/* Replace image button */}
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     id={`file-replace-${id}`}
//                   />
//                   <label
//                     htmlFor={`file-replace-${id}`}
//                     className="bg-white text-gray-800 p-2 rounded-full cursor-pointer"
//                     title="Replace image"
//                   >
//                     <Upload className="w-5 h-5" />
//                   </label>

//                   {/* Remove image button */}
//                   <Button
//                     variant="destructive"
//                     size="icon"
//                     className="rounded-full w-9 h-9"
//                     onClick={() => handleRemoveImage(images[0].id)}
//                     title="Remove image"
//                   >
//                     <X className="w-5 h-5" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Optional description field */}
//               {showDescriptionFields && (
//                 <Input
//                   type="text"
//                   placeholder={descriptionPlaceholder}
//                   value={images[0].description}
//                   onChange={(e) => handleDescriptionChange(images[0].id, e.target.value)}
//                   className="mt-2 w-full"
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       // Multiple image upload mode
//       return (
//         <div className="mb-4">
//           <label className="block mb-2 font-medium">Upload Images</label>
//           <div className="p-4 border border-dashed border-gray-400 rounded-lg">
//             {/* File input area */}
//             <div
//               className="cursor-pointer p-6 text-center border border-gray-300 rounded-lg hover:bg-gray-100 mb-4"
//               onDrop={(e) => {
//                 e.preventDefault();
//                 handleFileChange({
//                   target: { files: e.dataTransfer.files },
//                 } as React.ChangeEvent<HTMLInputElement>);
//               }}
//               onDragOver={(e) => e.preventDefault()}
//             >
//               <Input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id={`file-input-${id}`}
//               />
//               <label
//                 htmlFor={`file-input-${id}`}
//                 className="cursor-pointer w-full h-full flex items-center justify-center"
//               >
//                 {uploadLabel}
//               </label>
//             </div>

//             {/* Grid of uploaded images */}
//             {images.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {images.map((img) => (
//                   <Card key={img.id} className="relative">
//                     {/* Delete button for individual image */}
//                     <Button
//                       variant="ghost"
//                       className="absolute top-1 right-1 p-1 h-auto"
//                       onClick={() => handleRemoveImage(img.id)}
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                     <CardContent className="flex flex-col items-center p-3">
//                       {/* Image preview */}
//                       <img src={img.preview} alt="uploaded preview" className="w-full h-32 object-cover rounded-lg" />
//                       {/* Optional description input */}
//                       {showDescriptionFields && (
//                         <Input
//                           type="text"
//                           placeholder={descriptionPlaceholder}
//                           value={img.description}
//                           onChange={(e) => handleDescriptionChange(img.id, e.target.value)}
//                           className="mt-2 w-full"
//                         />
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <Card className="mb-6 relative">
//       {/* Delete button for the entire upload box */}
//       {removable && (
//         <Button
//           variant="ghost"
//           className="absolute top-2 right-2 text-red-500"
//           onClick={() => onRemove!(id)}
//           title="Remove this upload box"
//         >
//           <Trash2 className="w-5 h-5" />
//         </Button>
//       )}

//       <CardHeader>
//         <CardTitle className="text-lg">{title}</CardTitle>
//       </CardHeader>

//       <CardContent>
//         {/* Optional name input field */}
//         {showName && (
//           <div className="mb-4">
//             <label htmlFor={`name-${id}`} className="block mb-2 font-medium">
//               {nameLabel}
//             </label>
//             <Input
//               id={`name-${id}`}
//               type="text"
//               placeholder={namePlaceholder}
//               value={name}
//               onChange={handleNameChange}
//               className="w-full"
//             />
//             <label htmlFor={`relationship-${id}`} className="block mb-2 font-medium">
//               {relationshipLabel}
//             </label>
//             <Input
//               id={`relationship-${id}`}
//               type="text"
//               placeholder={relationshipPlaceholder}
//               value={relationship}
//               onChange={handleRelationshipChange}
//               className="w-full"
//             />
//           </div>
//         )}

//         {/* Image upload section - renders differently based on mode */}
//         {renderImageUpload()}

//         {showButton && (
//           <div className="mt-4">
//             <Button
//               variant="outline"
//               className="w-full"
//               type={buttonType}
//               onClick={onButtonClick}
//               disabled={images.length === 0}
//             >
//               {buttonText}
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default UploadBox;
