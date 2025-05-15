// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// // import { useUserProfile } from '@/hooks/useUserProfile';
// import Modal from '@/components/Modal';
// import MyProfile from '@/components/MyProfile';

// const NewUserInstruct: React.FC = () => {
//   const navigate = useNavigate();
//   // const { userProfile } = useUserProfile();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // <div className="container mx-auto p-4 pt-20">
//   // <div className="flex justify-center items-center mb-6">
//   //   <h1 className="text-2xl font-bold">Upload Images</h1>
//   // </div>
//   return (
//     <div className="container mx-auto p-4 pt-20 ">
//       <h1 className="text-3xl font-bold p-1">Get Started!</h1>
//       <h2 className='text-2xl text-left'>1. Complete your profile.</h2>
//       <button className="upload-button" onClick={() => setIsModalOpen(true)}>
//         My Profile
//       </button>
//       <h2 className='text-2xl text-left'>2. Upload images of people you know.</h2>
//       <button className="upload-button" onClick={() => navigate("/upload")}>
//         Upload Images
//       </button>
//       <Modal isOpen={isModalOpen}>
//         <MyProfile isEditing onClose={() => setIsModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// }
// {/* <h2 className="login-title">Welcome!</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 className="input-field"
//                 placeholder='Enter email'
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div> */}
// export default NewUserInstruct
