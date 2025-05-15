// layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/contexts/AuthContext";
import UserProfileProvider from "@/contexts/UserProfileContext";
import JobProvider from "@/contexts/JobContext";
import "@/assets/styles/App.css";
import "@/assets/styles/index.css";
import SessionTimeoutDialog from "@/components/SessionTimeoutDialog";
import useSessionTimeout from "@/hooks/useSessionTimeout";

export default function RootLayout() {
  const { showWarningDialog, stayLoggedIn } = useSessionTimeout();

  return (
    <div className="App">
      <AuthProvider>
        <UserProfileProvider>
          <JobProvider>
            <Navbar />
            <div className="container mx-auto px-4 pt-16">
              <Outlet />
            </div>

            <SessionTimeoutDialog show={showWarningDialog} onStayLoggedIn={stayLoggedIn} />
          </JobProvider>
        </UserProfileProvider>
      </AuthProvider>
    </div>
  );
}

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
