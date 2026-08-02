// // import React from 'react'
// // import Navbar from "./Components/Navbar";
// // import Data from './Components/Data';
// // import Findmatch from './Components/Findmatch';
// // import Eligible from './Components/Eligible';
// // import CompanyCards from './Components/CompanyCards';
// // import { Routes, Route } from 'react-router-dom';

// // const App = () => {
// //   return (
// //     <div className='min-h-screen overflow-y-auto pb-20'>
// //      <Navbar />
// //      <Data />
// //      <Findmatch />
// //      <Eligible />
// //      <CompanyCards />
// //     </div>
// //   )
// // }

// // export default App


// import React from 'react'
// import Navbar from "./Components/Navbar";
// import Data from './Components/Data';
// import Findmatch from './Components/Findmatch';
// import Eligible from './Components/Eligible';
// import CompanyCards from './Components/CompanyCards';
// import Upcoming from './Components/Upcoming';
// import { Routes, Route } from 'react-router-dom';
// import FindMatch from './Components/FindMatchSection/FindMatch';
// import Profile from './Components/Profile/Profile';
// import ViewApply from './Components/ViewApply/ViewApply';
// import Notifications from "./Components/Notifications/Notifications";


// const App = () => {
//   return (
//     <div className='min-h-screen overflow-y-auto pb-20'>

//       <Routes>

//         {/* Dashboard */}
//         <Route
//           path="/"
//           element={
//             <>
//               <Navbar />
//               <Data />
//               <Findmatch />
//               <Eligible />
//               <CompanyCards />
//             </>
//           }
//         />

//         {/* Upcoming Companies */}
//         <Route
//           path="/upcoming"
//           element={
//             <>
//               <Navbar />
//               <Upcoming />
//             </>
//           }
//         />

//         {/* Find Match */}
//         <Route
//           path="/findmatch"
//           element={
//             <>
//               <Navbar />
//               <FindMatch />
//             </>
//           }
//         />

//         {/* Profile */}
//         <Route
//           path="/profile"
//           element={
//             <>
//               <Navbar />
//               <Profile />
//             </>
//           }
//         />

//         {/* Notifications */}
//         <Route
//           path="/notifications"
//           element={
//             <>
//               <Navbar />
//               <Notifications />
//             </>
//           }
//         />

//         {/* View Apply */}
//         <Route
//           path="/viewapply"
//           element={
//             <>
//               <Navbar />
//               <ViewApply />
//             </>
//           }
//         />

//         <Route
//           path="/home"
//           element={
//             <>
//               <Home />
//               <Navbar />
//             </>
//           }
//         />

//       </Routes>

//     </div>
//   )
// }

// export default App



import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from './api';

// Common Components
import Login from './Components/Login';
import AdminLogin from './Components/AdminLogin';
import VerifyEmail from './Components/VerifyEmail';
import ForgotPassword from './Components/ForgotPassword';

// Student Components
import Navbar from './Components/Navbar';
import Data from './Components/Data';
import Findmatch from './Components/Findmatch';
import Eligible from './Components/Eligible';
import CompanyCards from './Components/CompanyCards';
import Upcoming from './Components/Upcoming';
import FindMatchSection from './Components/FindMatchSection/FindMatch';
import Profile from './Components/Profile/Profile';
import ViewApply from './Components/ViewApply/ViewApply';
import Notifications from './Components/Notifications/Notifications';
import AppliedCompanies from './Components/AppliedCompanies/AppliedCompanies';

// Admin Components
import Sidebar from './Admin/Componentss/Sidebar';
import Dashboard from './Admin/Componentss/Dashboard';
import Add from './Admin/Add/Add';
import SendNotification from './Admin/SendNotification/SendNotification';
import Manage from './Admin/Manage/Manage';
import ManageDetails from './Admin/Manage/ManageDetails';
import Applied from './Admin/Applied/Applied';
import Applieddata from './Admin/Applied/Applieddata';
import RegisteredStudents from './Admin/RegisteredStudents';

const App = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole') || null);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Fetch companies from backend Mongoose API
  const fetchCompanies = async () => {
    if (localStorage.getItem('authToken')) {
      try {
        setLoadingCompanies(true);
        const response = await api.get('/api/companies');
        const mappedCompanies = response.data.companies.map(c => ({
          id: c._id,
          name: c.name,
          cgpa: c.cgpa.toString(),
          role: c.role,
          packageLpa: c.packageLpa,
          location: c.location,
          date: new Date(c.visitDate).toLocaleDateString(),
          visitDate: c.visitDate,
          lastDateToApply: c.lastDateToApply,
          minClass10Percentage: c.minClass10Percentage || 0,
          minClass12Percentage: c.minClass12Percentage || 0,
          description: c.description,
          jobDescription: c.jobDescription || '',
          skills: c.skills,
          courses: c.courses,
          rounds: c.rounds || [],
          currentRoundIndex: c.currentRoundIndex || 0,
          status: c.status,
          category: c.category || 'Tech',
          logo: c.logo,
          appliedStudentsCount: 0 // Will query from backend or calculate
        }));
        setCompanies(mappedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    } else {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [role]);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
  };

  const handleDeleteCompany = async (id) => {
    try {
      await api.delete(`/api/companies/${id}`);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
    } catch (error) {
      console.error('Error deleting company from database:', error);
    }
  };

  return (
    <Routes>
      {/* ---------------- 1. LOGIN ROUTE (Always Render Login directly) ---------------- */}
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------------- 2. STUDENT PORTAL ROUTES ---------------- */}
      <Route
        path="/student-dashboard"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <Data />
              <Findmatch />
              <Eligible />
              <CompanyCards companies={companies} loading={loadingCompanies} />
            </div>
          ) : (
            <Navigate to="/login?redirect=/student-dashboard" replace />
          )
        }
      />
      <Route
        path="/upcoming"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <Upcoming companies={companies} loading={loadingCompanies} />
            </div>
          ) : (
            <Navigate to="/login?redirect=/upcoming" replace />
          )
        }
      />
      <Route
        path="/findmatch"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <FindMatchSection />
            </div>
          ) : (
            <Navigate to="/login?redirect=/findmatch" replace />
          )
        }
      />
      <Route
        path="/applied-companies"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <AppliedCompanies />
            </div>
          ) : (
            <Navigate to="/login?redirect=/applied-companies" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <Profile />
            </div>
          ) : (
            <Navigate to="/login?redirect=/profile" replace />
          )
        }
      />
      <Route
        path="/notifications"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <Notifications />
            </div>
          ) : (
            <Navigate to="/login?redirect=/notifications" replace />
          )
        }
      />
      <Route
        path="/viewapply"
        element={
          role === 'student' ? (
            <div className='min-h-screen overflow-y-auto pb-20 bg-[#0F172A]'>
              <Navbar />
              <ViewApply />
            </div>
          ) : (
            <Navigate to="/login?redirect=/viewapply" replace />
          )
        }
      />

      {/* ---------------- 3. ADMIN PORTAL ROUTES ---------------- */}
      <Route
        path="/admin-dashboard"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <Dashboard companies={companies} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/add-company"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <Add setCompanies={setCompanies} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/send-notification"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <SendNotification />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/applied-students"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <Applied companies={companies} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/registered-students"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <RegisteredStudents />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/applied-students/:id"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <Applieddata companies={companies} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/manage-companies"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <Manage companies={companies} onDeleteCompany={handleDeleteCompany} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />
      <Route
        path="/manage/:id"
        element={
          role === 'admin' ? (
            <div className="min-h-screen bg-[#190F3B]">
              <Sidebar />
              <div className="ml-65 p-6">
                <ManageDetails companies={companies} onDeleteCompany={handleDeleteCompany} />
              </div>
            </div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />

      {/* Catch-all route to safely navigate back to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;