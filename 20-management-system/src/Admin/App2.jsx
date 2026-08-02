// import React, { useState } from 'react'
// import { Routes, Route } from 'react-router-dom'
// import Sidebar from './Componentss/Sidebar'
// import Dashboard from './Componentss/Dashboard'
// import Add from './Add/Add'
// import Manage from './Manage/Manage'
// import ManageDetails from './Manage/ManageDetails'
// import Applied from './Applied/Applied'
// import Applieddata from './Applied/Applieddata'

// const App = () => {
//   // Global Companies List State
//   const [companies, setCompanies] = useState([
//     {
//       id: "microsoft",
//       name: "Microsoft",
//       cgpa: "7.5",
//       role: "Tech",
//       packageLpa: "22 LPA",
//       location: "Hyderabad",
//       date: "20/04/2026",
//       description: "Multinational technology corporation producing computer software and consumer electronics.",
//       skills: ["Python", "Java", "Cloud"],
//       courses: ["BTech"],
//       rounds: [
//         { id: 1, name: "Aptitude" },
//         { id: 2, name: "Technical" },
//         { id: 3, name: "HR" },
//         { id: 4, name: "Managerial" },
//       ],
//       appliedStudentsCount: 0,
//     },
//     {
//       id: "amazon",
//       name: "Amazon",
//       cgpa: "7.8",
//       role: "Tech",
//       packageLpa: "20 LPA",
//       location: "Mumbai",
//       date: "25/04/2026",
//       description: "E-commerce and cloud computing giant.",
//       skills: ["AWS", "Node.js", "System Design"],
//       courses: ["BTech", "MCA"],
//       rounds: [
//         { id: 1, name: "Aptitude" },
//         { id: 2, name: "Technical" },
//         { id: 3, name: "HR" },
//       ],
//       appliedStudentsCount: 5,
//     },
//     {
//       id: "salesforce",
//       name: "Salesforce",
//       cgpa: "7",
//       role: "Sales",
//       packageLpa: "12 LPA",
//       location: "Pune",
//       date: "01/05/2026",
//       description: "Cloud-based software company focusing on CRM.",
//       skills: ["CRM", "Salesforce Apex", "Communication"],
//       courses: ["BCA", "BTech"],
//       rounds: [
//         { id: 1, name: "Aptitude" },
//         { id: 2, name: "HR" },
//       ],
//       appliedStudentsCount: 2,
//     },
//     {
//       id: "infosys",
//       name: "Infosys",
//       cgpa: "7",
//       role: "Tech",
//       packageLpa: "8 LPA",
//       location: "Bangalore",
//       date: "05/05/2026",
//       description: "IT consulting and services company.",
//       skills: ["Java", "SQL", "Web Dev"],
//       courses: ["BTech"],
//       rounds: [
//         { id: 1, name: "Aptitude" },
//         { id: 2, name: "Technical" },
//         { id: 3, name: "HR" },
//       ],
//       appliedStudentsCount: 12,
//     },
//     {
//       id: "wipro",
//       name: "Wipro",
//       cgpa: "6.5",
//       role: "Tech",
//       packageLpa: "7 LPA",
//       location: "Chennai",
//       date: "10/05/2026",
//       description: "Global information technology corporation.",
//       skills: ["C++", "Java", "Linux"],
//       courses: ["BTech", "MTech"],
//       rounds: [
//         { id: 1, name: "Aptitude" },
//         { id: 2, name: "Technical" },
//       ],
//       appliedStudentsCount: 8,
//     },
//     {
//       id: "vcscvcd",
//       name: "vcscvcd",
//       cgpa: "6.5",
//       role: "Sales",
//       packageLpa: "5 LPA",
//       location: "Delhi",
//       date: "07/07/2026",
//       description: "Sales & consultancy service.",
//       skills: ["Marketing", "Sales"],
//       courses: ["BCA"],
//       rounds: [{ id: 1, name: "HR" }],
//       appliedStudentsCount: 0,
//     },
//     {
//       id: "cvcxv",
//       name: "cvcxv",
//       cgpa: "4",
//       role: "Tech",
//       packageLpa: "8 LPA",
//       location: "cvxv",
//       date: "27/07/2026",
//       description: "Tech solutions provider.",
//       skills: ["Testing"],
//       courses: ["BTech"],
//       rounds: [{ id: 1, name: "Technical" }],
//       appliedStudentsCount: 0,
//     },
//   ]);

//   // Delete Function passed to manage pages
//   const handleDeleteCompany = (id) => {
//     setCompanies((prev) => prev.filter((company) => company.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-[#190F3B]">
//       <Sidebar />

//       <div className="ml-65 p-6">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />

//           <Route path="/add-company" element={<Add />} />

//           {/* Applied Students Routes with Companies Prop */}
//           <Route 
//             path="/applied-students" 
//             element={<Applied companies={companies} />} 
//           />
//           <Route 
//             path="/applied-students/:id" 
//             element={<Applieddata companies={companies} />} 
//           />

//           <Route
//             path="/manage-companies"
//             element={
//               <Manage
//                 companies={companies}
//                 onDeleteCompany={handleDeleteCompany}
//               />
//             }
//           />

//           <Route
//             path="/manage/:id"
//             element={
//               <ManageDetails
//                 companies={companies}
//                 onDeleteCompany={handleDeleteCompany}
//               />
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   )
// }

// export default App