// // import { useState } from 'react'
// import { Routes, Route } from "react-router-dom";
// import Navbar from "@/components/Navbar";
// import { Home, About, Identify, Upload } from "@/pages";
// import AuthProvider from "@/contexts/AuthContext";
// import "@/assets/styles/App.css";
// import SignUpComponent from "@/components/SignUp";
// import VerifyEmail from "@/components/VerifyEmail";
// import PasswordResetComponent from "@/components/PasswordReset";
// import TrainModel from "./pages/train";
// import Login from "./components/Login";
// import UserProfileProvider from "@/contexts/UserProfileContext";
// import MyProfile from "@/components/MyProfile";
// import JobProvider from "@/contexts/JobContext";
// import RemindeeDetails from "./pages/RemindeeDetails";

// function App() {
//   // const [count, setCount] = useState(0)
//   // here some are pages, and some are just components. Either is Ok
//   return (
//     <div className="App">
//       <AuthProvider>
//         <UserProfileProvider>
//           <JobProvider>
//             <Navbar />
//             <div className="container mx-auto px-4 pt-16">
//               {" "}
//               {/* Added padding-top to account for the fixed Navbar */}
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/identify" element={<Identify />} />
//                 <Route path="/upload" element={<Upload />} />
//                 <Route path="/train" element={<TrainModel />} />
//                 <Route path="/register" element={<SignUpComponent />} />
//                 <Route path="/verify-email" element={<VerifyEmail />} />
//                 <Route path="/reset-password" element={<PasswordResetComponent />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/profile" element={<MyProfile />} />
//                 <Route path="/remindee-details" element={<RemindeeDetails />} />
//               </Routes>
//             </div>
//           </JobProvider>
//         </UserProfileProvider>
//       </AuthProvider>
//     </div>
//   );
// }

// export default App;
