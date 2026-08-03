// import React from 'react'
// import { SquarePen } from 'lucide-react';
// import { Mail } from 'lucide-react';
// import { Award } from 'lucide-react';
// import { BrainCircuit } from 'lucide-react';
// import { FileText } from 'lucide-react';

// const Profileframe = () => {


//   const Skills = [
//     {
//       name: "Java Script",
//     },
//     {
//       name: "CSS",
//     }, 
//     {
//       name: "React.js",
//     }, 
//     {
//       name: "Tailwind Css",
//     }, ];
      



//   return (
// <div className='bg-[color-mix(in_oklab,_oklch(35.9%_0_0)_50%,_transparent)] w-200 h-200 ml-80 mt-10 rounded-2xl'>

//   <div className='h-30 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 rounded-t-2xl'></div>

//   <div className='bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ml-10 -mt-15 w-30 h-30 flex items-center justify-center rounded-2xl border-4 border-black'>
//     <h1 className='text-4xl font-bold text-white'>AP</h1>
//   </div>

//   <div className=' w-fit h-7 mt-4 flex gap-110 ml-10'>
//     <h1 className='text-2xl text-white font-bold'>Akshay Patidar</h1>
//     <button className='font-bold text-white rounded-2xl bg-gray-600 w-26 flex items-center justify-center gap-2 active:scale-95'>
//           <SquarePen size={16} className='ml-1'/>
//        <h1 className='text-xs'> Edit Profile </h1>
//     </button>

//      </div>
//      <h1 className='text-gray-500 ml-10 mt-2 font-bold'>Student</h1>



//     <div className='h-35 w-180 ml-10 mt-10 flex gap-11'>

//      <div className='bg-white/5 backdrop-blur-sm h-30 w-80 ml-3 mt-2 rounded-2xl border border-white/20'>
//              <div className='flex'>
//                <div className='mt-3 ml-8 bg-purple-300 p-2 rounded-md w-fit'>
//                  <Mail size={25} />
//               </div>
//               <h1 className='text-white  w-fit ml-3 mt-5'>Email Address</h1>
//              </div>
//              <h1 className='text-white ml-8 mt-3'>akshaypatidar244@gmail.com</h1>
//      </div>


//      <div className='bg-white/5 backdrop-blur-sm h-30 w-80 mt-2 ml-3 rounded-2xl border border-white/20'>
//   <div className='flex'>
//                <div className='mt-3 ml-8 bg-purple-300 p-2 rounded-md w-fit'>
//                  <Award size={25} />
//               </div>
//               <h1 className='text-white  w-fit ml-3 mt-5'>CGPA</h1>
//              </div>
//              <h1 className='text-white ml-8 mt-3 text-2xl'>8.5</h1>
//      </div>
//      </div>


     
//      <div className='h-30 w-175 ml-12 mt-5 bg-white/5 rounded-2xl border border-white/20 flex flex-col'>
        
//         <div className='flex'>
//                <div className='mt-3 ml-8 bg-purple-300 p-2 rounded-md w-fit'>
//                  <BrainCircuit size={25} />
//               </div>
//               <h1 className='text-white  w-fit ml-3 mt-5'>Skills</h1>
//              </div>
//              <div className='flex gap-2 ml-8 mt-4'>
//               {Skills.map((skill, index) => (
//             <span   key={index}  className='bg-purple-400 text-white font-bold px-4 h-10  rounded-xl flex items-center justify-center w-fit'>
//                 {skill.name}
//            </span>
//           ))}
//           </div>
//      </div>


//        <div className='h-38 w-175 ml-12 mt-8 bg-white/5 rounded-2xl border border-white/20 flex flex-col'>
//                 <div className='flex'>
//                <div className='mt-3 ml-8 bg-purple-300 p-2 rounded-md w-fit'>
//                  <FileText size={25} />
//               </div>
//               <h1 className='text-white  w-fit ml-3 mt-5'>Resume</h1>
//              </div>

             

//              <div className='bg-white/8 h-20 w-160 ml-8 mt-2 rounded-2xl flex items-center justify-between px-6'>

//            <div className='flex items-center gap-4'>
//             <div className='bg-purple-300 p-2 rounded-md'>
//                <FileText size={25}/>
//             </div>

//             <div>
//               <h1 className='text-white font-semibold'>resume_akshay_patidar.pdf</h1>
//                 <p className='text-gray-400 text-sm'>PDF Document</p>
//             </div>
//             </div>

//                <button className='bg-purple-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-purple-600 active:scale-95 transition-all'>
//                    View
//                </button>

//              </div>
//          </div>
       

  
//     </div>

//   )
// }

// export default Profileframe


import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { SquarePen, Mail, Award, BrainCircuit, FileText, Camera, Check, Upload, Trash2 } from 'lucide-react';
import api from '../../api';

const Profileframe = () => {
  const navigate = useNavigate();
  const serverUrl = api.defaults.baseURL || 'http://localhost:5000';
  
  const getFileUrl = (pathOrDataUri) => {
    if (!pathOrDataUri) return '';
    if (pathOrDataUri.startsWith('data:')) {
      try {
        const parts = pathOrDataUri.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error('Base64 to Blob conversion failed:', err);
        return pathOrDataUri;
      }
    }
    return `${serverUrl}${pathOrDataUri}`;
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toggle Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // User Profile Data State
  const [userData, setUserData] = useState({
    name: "",
    role: "Student",
    email: "",
    cgpa: "0.0",
    skills: [],
    skillsInput: ""
  });

  // Avatar Image State
  const [avatar, setAvatar] = useState(null);

  // Resume File State
  const [resume, setResume] = useState({
    fileName: "No resume uploaded",
    fileUrl: null
  });

  // New state for Educational Details
  const [eduDetails, setEduDetails] = useState({
    class10: { schoolName: '', board: '', percentage: '', location: '', marksheet: '' },
    class12: { schoolName: '', board: '', percentage: '', location: '', marksheet: '' },
    college: { semesters: [], totalBacklogs: 0, ongoingBacklogs: 0 }
  });

  // Load Profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me');
        const user = res.data.user;
        setUserData({
          name: user.name || '',
          role: user.role === 'admin' ? 'Admin' : 'Student',
          email: user.email || '',
          cgpa: user.cgpa ? user.cgpa.toString() : '0.0',
          skills: user.skills || [],
          skillsInput: user.skills ? user.skills.join(', ') : ''
        });
        
        if (user.profilePhoto) {
          setAvatar(getFileUrl(user.profilePhoto));
        }
        if (user.resume) {
          // Extract filename from path if it's a file path, otherwise default
          const isBase64 = user.resume.startsWith('data:');
          const rawName = isBase64 ? 'student_resume.pdf' : user.resume.split('-').slice(2).join('-');
          setResume({
            fileName: rawName || 'resume.pdf',
            fileUrl: getFileUrl(user.resume)
          });
        }

        if (user.educationalDetails) {
          setEduDetails({
            class10: {
              schoolName: user.educationalDetails.class10?.schoolName || '',
              board: user.educationalDetails.class10?.board || '',
              percentage: user.educationalDetails.class10?.percentage || '',
              location: user.educationalDetails.class10?.location || '',
              marksheet: user.educationalDetails.class10?.marksheet || ''
            },
            class12: {
              schoolName: user.educationalDetails.class12?.schoolName || '',
              board: user.educationalDetails.class12?.board || '',
              percentage: user.educationalDetails.class12?.percentage || '',
              location: user.educationalDetails.class12?.location || '',
              marksheet: user.educationalDetails.class12?.marksheet || ''
            },
            college: {
              semesters: user.educationalDetails.college?.semesters || [],
              totalBacklogs: user.educationalDetails.college?.totalBacklogs || 0,
              ongoingBacklogs: user.educationalDetails.college?.ongoingBacklogs || 0
            }
          });
        }
      } catch (error) {
        console.error('Error fetching student profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete('/api/auth/delete-account');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Delete account error:', err);
      alert(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    if (e.target.name === 'cgpa') {
      const val = e.target.value;
      if (val !== "" && parseFloat(val) > 10) {
        alert("CGPA cannot be more than 10");
        return;
      }
    }
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Educational Inputs Change
  const handleEduInputChange = (e, section, field) => {
    const value = e.target.value;
    setEduDetails(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCollegeInputChange = (e, field) => {
    const value = e.target.value;
    setEduDetails(prev => ({
      ...prev,
      college: {
        ...prev.college,
        [field]: value
      }
    }));
  };

  const handleSemesterSgpaChange = (e, semesterNumber) => {
    const value = e.target.value;
    if (value !== "" && parseFloat(value) > 10) {
      alert("SGPA cannot be more than 10");
      return;
    }
    setEduDetails(prev => {
      const semesters = [...prev.college.semesters];
      const existing = semesters.find(s => s.semesterNumber === semesterNumber);
      if (existing) {
        existing.sgpa = value;
      } else {
        semesters.push({ semesterNumber, sgpa: value, marksheet: '' });
      }
      return {
        ...prev,
        college: { ...prev.college, semesters }
      };
    });
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      try {
        const res = await api.post('/api/students/upload-photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAvatar(getFileUrl(res.data.photoUrl));
      } catch (error) {
        console.error('Photo upload error:', error);
        alert('Failed to upload profile photo.');
      }
    }
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      try {
        const res = await api.post('/api/students/upload-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setResume({
          fileName: file.name,
          fileUrl: getFileUrl(res.data.resumeUrl)
        });
      } catch (error) {
        console.error('Resume upload error:', error);
        alert('Failed to upload resume. Please upload PDF or DOC/DOCX files.');
      }
    }
  };

  // Marksheet Upload Handler
  const handleMarksheetUpload = async (e, type, semesterNumber = null) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('marksheet', file);
      formData.append('type', type);
      if (semesterNumber !== null) {
        formData.append('semesterNumber', semesterNumber);
      }
      try {
        const res = await api.post('/api/students/upload-marksheet', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const fileUrl = res.data.fileUrl;
        
        setEduDetails(prev => {
          if (type === 'class10') {
            return {
              ...prev,
              class10: { ...prev.class10, marksheet: fileUrl }
            };
          } else if (type === 'class12') {
            return {
              ...prev,
              class12: { ...prev.class12, marksheet: fileUrl }
            };
          } else if (type === 'semester') {
            const semesters = [...prev.college.semesters];
            const existing = semesters.find(s => s.semesterNumber === semesterNumber);
            if (existing) {
              existing.marksheet = fileUrl;
            } else {
              semesters.push({ semesterNumber, sgpa: 0, marksheet: fileUrl });
            }
            return {
              ...prev,
              college: { ...prev.college, semesters }
            };
          }
          return prev;
        });
        alert('Marksheet uploaded successfully!');
      } catch (error) {
        console.error('Marksheet upload error:', error);
        alert('Failed to upload marksheet.');
      }
    }
  };

  // Delete Marksheet Handler
  const handleDeleteMarksheet = async (type, semesterNumber = null) => {
    if (!window.confirm("Are you sure you want to delete this marksheet?")) return;
    try {
      await api.post('/api/students/delete-marksheet', { type, semesterNumber });
      setEduDetails(prev => {
        if (type === 'class10') {
          return {
            ...prev,
            class10: { ...prev.class10, marksheet: '' }
          };
        } else if (type === 'class12') {
          return {
            ...prev,
            class12: { ...prev.class12, marksheet: '' }
          };
        } else if (type === 'semester') {
          const semesters = [...prev.college.semesters];
          const existing = semesters.find(s => s.semesterNumber === semesterNumber);
          if (existing) {
            existing.marksheet = '';
          }
          return {
            ...prev,
            college: { ...prev.college, semesters }
          };
        }
        return prev;
      });
      alert('Marksheet deleted successfully!');
    } catch (error) {
      console.error('Delete marksheet error:', error);
      alert('Failed to delete marksheet.');
    }
  };

  // Save Changes
  const handleSave = async () => {
    const updatedSkills = userData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await api.put('/api/students/profile', {
        name: userData.name,
        cgpa: userData.cgpa,
        skills: updatedSkills,
        educationalDetails: {
          class10: {
            schoolName: eduDetails.class10.schoolName,
            board: eduDetails.class10.board,
            percentage: eduDetails.class10.percentage ? parseFloat(eduDetails.class10.percentage) : 0,
            location: eduDetails.class10.location
          },
          class12: {
            schoolName: eduDetails.class12.schoolName,
            board: eduDetails.class12.board,
            percentage: eduDetails.class12.percentage ? parseFloat(eduDetails.class12.percentage) : 0,
            location: eduDetails.class12.location
          },
          college: {
            semesters: eduDetails.college.semesters.map(s => ({
              semesterNumber: s.semesterNumber,
              sgpa: s.sgpa ? parseFloat(s.sgpa) : 0,
              marksheet: s.marksheet
            })),
            totalBacklogs: parseInt(eduDetails.college.totalBacklogs) || 0,
            ongoingBacklogs: parseInt(eduDetails.college.ongoingBacklogs) || 0
          }
        }
      });

      setUserData({
        ...userData,
        skills: updatedSkills
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Save profile error:', error);
      alert('Failed to save profile details.');
    }
  };

  return (
    <div className='bg-indigo-950 w-200 h-auto pb-10 ml-80 mt-10 rounded-2xl border border-white/10 shadow-2xl'>

      {/* Top Banner */}
      <div className='h-30 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 rounded-t-2xl'></div>

      {/* Profile Picture Section */}
      <div className='relative w-fit'>
        <div className='bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ml-10 -mt-15 w-30 h-30 flex items-center justify-center rounded-2xl border-4 border-black overflow-hidden relative group'>
          {avatar ? (
            <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
          ) : (
            <h1 className='text-4xl font-bold text-white'>AP</h1>
          )}

          {/* Photo Change Input (In Edit Mode or Hover) */}
          <label htmlFor="photo-upload" className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" />
          </label>
          <input type="file" id="photo-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>

      {/* Profile Name and Edit Button */}
      <div className='w-fit min-w-[680px] h-auto mt-4 flex justify-between items-center px-10'>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="text-2xl text-white font-bold bg-white/10 border border-purple-400 rounded-xl px-3 py-1 outline-none"
          />
        ) : (
          <h1 className='text-2xl text-white font-bold'>{userData.name}</h1>
        )}

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`font-bold text-white rounded-2xl px-4 py-2 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
            isEditing ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          {isEditing ? (
            <>
              <Check size={16} />
              <span className='text-xs'> Save Profile </span>
            </>
          ) : (
            <>
              <SquarePen size={16} />
              <span className='text-xs'> Edit Profile </span>
            </>
          )}
        </button>
      </div>

      <h1 className='text-gray-500 ml-10 mt-2 font-bold'>{userData.role}</h1>

      {/* Cards Grid: Email & CGPA */}
      <div className='h-35 w-180 ml-10 mt-6 flex gap-11'>

        {/* Email Box */}
        <div className='bg-white/5 backdrop-blur-sm h-30 w-80 ml-3 rounded-2xl border border-white/20 p-3'>
          <div className='flex items-center'>
            <div className='bg-purple-300 p-2 rounded-md w-fit text-black'>
              <Mail size={22} />
            </div>
            <h1 className='text-white ml-3 font-semibold'>Email Address</h1>
          </div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="text-white bg-white/10 border border-purple-400 rounded-lg px-2 py-1 text-sm mt-3 w-full outline-none"
            />
          ) : (
            <h1 className='text-white ml-3 mt-3 text-sm truncate'>{userData.email}</h1>
          )}
        </div>

        {/* CGPA Box */}
        <div className='bg-white/5 backdrop-blur-sm h-30 w-80 ml-3 rounded-2xl border border-white/20 p-3'>
          <div className='flex items-center'>
            <div className='bg-purple-300 p-2 rounded-md w-fit text-black'>
              <Award size={22} />
            </div>
            <h1 className='text-white ml-3 font-semibold'>CGPA</h1>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="cgpa"
              value={userData.cgpa}
              onChange={handleInputChange}
              className="text-white bg-white/10 border border-purple-400 rounded-lg px-2 py-1 text-lg font-bold mt-2 w-full outline-none"
            />
          ) : (
            <h1 className='text-white ml-3 mt-2 text-2xl font-bold'>{userData.cgpa}</h1>
          )}
        </div>

      </div>

      {/* Skills Box */}
      <div className='min-h-[120px] w-175 ml-12 mt-5 bg-white/5 rounded-2xl border border-white/20 p-4 flex flex-col justify-center'>
        <div className='flex items-center mb-3'>
          <div className='bg-purple-300 p-2 rounded-md w-fit text-black'>
            <BrainCircuit size={22} />
          </div>
          <h1 className='text-white font-semibold ml-3'>Skills</h1>
        </div>

        {isEditing ? (
          <div className="ml-3">
            <input
              type="text"
              name="skillsInput"
              value={userData.skillsInput}
              onChange={handleInputChange}
              placeholder="Comma separated skills (e.g. React, C++, Node.js)"
              className="w-full text-white bg-white/10 border border-purple-400 rounded-lg px-3 py-1.5 text-sm outline-none"
            />
            <span className="text-gray-400 text-xs mt-1 block">Separate skills with commas (,)</span>
          </div>
        ) : (
          <div className='flex flex-wrap gap-2 ml-3'>
            {userData.skills.map((skill, index) => (
              <span key={index} className='bg-purple-400 text-white font-bold px-4 py-1.5 rounded-xl flex items-center justify-center text-sm w-fit'>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resume Box */}
      <div className='w-175 ml-12 mt-8 bg-white/5 rounded-2xl border border-white/20 p-4 flex flex-col'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center'>
            <div className='bg-purple-300 p-2 rounded-md w-fit text-black'>
              <FileText size={22} />
            </div>
            <h1 className='text-white font-semibold ml-3'>Resume</h1>
          </div>

          {/* Change Resume Button */}
          <label htmlFor="resume-upload" className="bg-purple-500/30 border border-purple-400/50 hover:bg-purple-500/50 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload size={14} /> Upload New Resume
          </label>
          <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
        </div>

        <div className='bg-white/10 h-20 w-full rounded-2xl flex items-center justify-between px-6 border border-white/5'>
          <div className='flex items-center gap-4'>
            <div className='bg-purple-300 p-2 rounded-md text-black'>
              <FileText size={22} />
            </div>

            <div className="overflow-hidden">
              <h1 className='text-white font-semibold text-sm truncate max-w-[280px]'>
                {resume.fileName}
              </h1>
              <p className='text-gray-400 text-xs'>PDF Document</p>
            </div>
          </div>

          {resume.fileUrl ? (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className='bg-purple-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-purple-600 active:scale-95 transition-all text-sm'
            >
              View
            </a>
          ) : (
            <button
              onClick={() => alert("Static/Sample Resume File Selected")}
              className='bg-purple-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-purple-600 active:scale-95 transition-all text-sm cursor-pointer'
            >
              View
            </button>
          )}
        </div>
      </div>

      {/* Educational Details Box */}
      <div className='w-175 ml-12 mt-8 bg-white/5 rounded-2xl border border-white/20 p-5 flex flex-col text-white'>
        <div className='flex items-center mb-4'>
          <div className='bg-purple-300 p-2 rounded-md w-fit text-black mr-3'>
            <Award size={22} />
          </div>
          <h1 className='text-lg font-bold'>Educational Details</h1>
        </div>

        {/* 10th Standard Details */}
        <div className="border-b border-white/10 pb-4 mb-4">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Class 10th / Matriculation</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">SCHOOL NAME</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class10.schoolName}
                  onChange={(e) => handleEduInputChange(e, 'class10', 'schoolName')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class10.schoolName || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">BOARD NAME</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class10.board}
                  onChange={(e) => handleEduInputChange(e, 'class10', 'board')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class10.board || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">PERCENTAGE (%)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={eduDetails.class10.percentage}
                  onChange={(e) => handleEduInputChange(e, 'class10', 'percentage')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class10.percentage ? `${eduDetails.class10.percentage}%` : 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">LOCATION</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class10.location}
                  onChange={(e) => handleEduInputChange(e, 'class10', 'location')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class10.location || 'N/A'}</p>
              )}
            </div>
          </div>
          
          {/* Marksheet Upload */}
          <div className="flex items-center justify-between mt-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-[11px] text-gray-300 font-medium">10th Marksheet:</span>
            <div className="flex items-center gap-2">
              {eduDetails.class10.marksheet && (
                <div className="flex gap-1.5 items-center">
                  <a
                    href={getFileUrl(eduDetails.class10.marksheet)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold"
                  >
                    View Marksheet
                  </a>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMarksheet('class10')}
                      className="bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 p-1 rounded-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                      title="Delete Marksheet"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )}
              {isEditing && !eduDetails.class10.marksheet && (
                <label className="bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/40 text-purple-200 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                  <Upload size={10} className="inline mr-1" /> Upload
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleMarksheetUpload(e, 'class10')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 12th Standard Details */}
        <div className="border-b border-white/10 pb-4 mb-4">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Class 12th / Higher Secondary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">SCHOOL NAME</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class12.schoolName}
                  onChange={(e) => handleEduInputChange(e, 'class12', 'schoolName')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class12.schoolName || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">BOARD NAME</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class12.board}
                  onChange={(e) => handleEduInputChange(e, 'class12', 'board')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class12.board || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">PERCENTAGE (%)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={eduDetails.class12.percentage}
                  onChange={(e) => handleEduInputChange(e, 'class12', 'percentage')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class12.percentage ? `${eduDetails.class12.percentage}%` : 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">LOCATION</label>
              {isEditing ? (
                <input
                  type="text"
                  value={eduDetails.class12.location}
                  onChange={(e) => handleEduInputChange(e, 'class12', 'location')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.class12.location || 'N/A'}</p>
              )}
            </div>
          </div>
          
          {/* Marksheet Upload */}
          <div className="flex items-center justify-between mt-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-[11px] text-gray-300 font-medium">12th Marksheet:</span>
            <div className="flex items-center gap-2">
              {eduDetails.class12.marksheet && (
                <div className="flex gap-1.5 items-center">
                  <a
                    href={getFileUrl(eduDetails.class12.marksheet)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold"
                  >
                    View Marksheet
                  </a>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMarksheet('class12')}
                      className="bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 p-1 rounded-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                      title="Delete Marksheet"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )}
              {isEditing && !eduDetails.class12.marksheet && (
                <label className="bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/40 text-purple-200 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                  <Upload size={10} className="inline mr-1" /> Upload
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleMarksheetUpload(e, 'class12')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* College / Semester Details */}
        <div>
          <h3 className="text-sm font-semibold text-purple-300 mb-3">College Semester Details</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">TOTAL BACKLOGS</label>
              {isEditing ? (
                <input
                  type="number"
                  value={eduDetails.college.totalBacklogs}
                  onChange={(e) => handleCollegeInputChange(e, 'totalBacklogs')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.college.totalBacklogs || '0'}</p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block mb-1">ONGOING BACKLOGS</label>
              {isEditing ? (
                <input
                  type="number"
                  value={eduDetails.college.ongoingBacklogs}
                  onChange={(e) => handleCollegeInputChange(e, 'ongoingBacklogs')}
                  className="w-full text-white bg-white/10 border border-purple-400/30 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-400"
                />
              ) : (
                <p className="text-xs text-gray-200">{eduDetails.college.ongoingBacklogs || '0'}</p>
              )}
            </div>
          </div>

          <label className="text-[10px] text-gray-400 font-semibold block mb-2">SEMESTER MARKS & MARKSHEETS</label>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
              const semObj = eduDetails.college.semesters.find(s => s.semesterNumber === semNum) || { sgpa: '', marksheet: '' };
              return (
                <div key={semNum} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-xs">
                  <span className="font-semibold text-gray-300">Semester {semNum}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 font-semibold">SGPA:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          placeholder="SGPA"
                          value={semObj.sgpa}
                          onChange={(e) => handleSemesterSgpaChange(e, semNum)}
                          className="w-14 text-white bg-white/10 border border-purple-400/30 rounded px-1.5 py-0.5 text-center text-xs outline-none"
                        />
                      ) : (
                        <span className="font-bold text-green-400">{semObj.sgpa || 'N/A'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {semObj.marksheet && (
                        <div className="flex gap-1.5 items-center">
                          <a
                            href={getFileUrl(semObj.marksheet)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold"
                          >
                            View
                          </a>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMarksheet('semester', semNum)}
                              className="bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 p-0.5 rounded cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                              title="Delete Marksheet"
                            >
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      )}
                      {isEditing && !semObj.marksheet && (
                        <label className="bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer">
                          Upload
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleMarksheetUpload(e, 'semester', semNum)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className='w-175 ml-12 mt-8 bg-red-950/10 border border-red-500/20 rounded-2xl p-4 flex flex-col'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-red-400 font-bold text-sm flex items-center gap-1.5'>
              <Trash2 size={16} /> Danger Zone
            </h1>
            <p className='text-gray-400 text-xs mt-1'>Permanently delete your profile and application history.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className='bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all'
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-[#16122a] border border-red-500/30 rounded-3xl p-6 w-[400px] shadow-2xl animate-fade-in text-white">
            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <Trash2 size={20} /> Confirm Account Deletion
            </h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to permanently delete your account? This action cannot be undone. All your details and applied applications will be permanently wiped out.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profileframe;