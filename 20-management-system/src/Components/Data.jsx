// import React from 'react'

// const Data = () => {
//   return (
//     <div className='flex  gap-0.5'>
//         <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-30 
// flex flex-col p-4 hover:-translate-y-2 duration-300 text-white'>

//     <div className='h-12 w-12 bg-violet-500 rounded-2xl 
//     flex items-center justify-center text-white'>
//         <h1 className='font-bold'>T/C</h1>
//     </div>

//     <h1 className='font-bold mt-3 text-3xl'>
//         Total Companies
//     </h1>

// </div>

//        <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-20 hover:-translate-y-2 duration-300 p-4 text-white'>
    
//     <div className='h-12 w-12 bg-violet-500 rounded-2xl flex items-center justify-center'>
//         <h1 className='font-bold'>E/C</h1>
//     </div>

//     <h1 className='font-bold mt-3 text-3xl'>
//         Eligible Companies
//     </h1>

// </div>
// <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-20 
// flex flex-col p-4 hover:-translate-y-2 duration-300 text-white'>

//     <div className='h-12 w-12 bg-violet-500 rounded-2xl 
//     flex items-center justify-center'>
//         <h1 className='font-bold'>A/C</h1>
//     </div>

//     <h1 className='font-bold mt-3 text-3xl'>
//         Applied Companies
//     </h1>

// </div>
//     </div>
//   )
// }

// export default Data

import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, Send } from 'lucide-react';
import api from '../api';

const Data = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Fetch user profile to check eligibility
        const profileRes = await api.get('/api/auth/me');
        const student = profileRes.data.user;

        // 2. Fetch all companies
        const companiesRes = await api.get('/api/companies');
        const companies = companiesRes.data.companies;
        setTotalCount(companies.length);

        // 3. Compute eligible companies count
        const eligible = companies.filter(company => {
          const cgpaMeets = student.cgpa >= company.cgpa;
          const courseMeets = !company.courses || company.courses.length === 0 || 
            company.courses.some(c => c.toLowerCase() === student.course.toLowerCase());
          return cgpaMeets && courseMeets;
        });
        setEligibleCount(eligible.length);

        // 4. Fetch applied applications count
        const applicationsRes = await api.get('/api/applications/my-applications');
        setAppliedCount(applicationsRes.data.count);
      } catch (error) {
        console.error('Error loading student dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='flex gap-0.5'>

      {/* Total Companies */}
      <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-30 flex flex-col p-4 hover:-translate-y-2 duration-300 text-white cursor-pointer'>
        <div className='h-12 w-12 bg-violet-500 rounded-2xl flex items-center justify-center text-white'>
          <Building2 size={24} />
        </div>

        <div className="flex justify-between items-end mt-3">
          <h1 className='font-bold text-3xl'>
            Total Companies
          </h1>
          <span className="text-3xl font-bold text-white">{totalCount}</span>
        </div>
      </div>

      {/* Eligible Companies */}
      <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-20 hover:-translate-y-2 duration-300 p-4 text-white cursor-pointer flex flex-col'>
        <div className='h-12 w-12 bg-violet-500 rounded-2xl flex items-center justify-center text-white'>
          <CheckCircle2 size={24} />
        </div>

        <div className="flex justify-between items-end mt-3">
          <h1 className='font-bold text-3xl'>
            Eligible Companies
          </h1>
          <span className="text-3xl font-bold text-white">{eligibleCount}</span>
        </div>
      </div>

      {/* Applied Companies */}
      <div className='bg-indigo-950 h-35 w-95 rounded-2xl mt-20 ml-20 flex flex-col p-4 hover:-translate-y-2 duration-300 text-white cursor-pointer'>
        <div className='h-12 w-12 bg-violet-500 rounded-2xl flex items-center justify-center text-white'>
          <Send size={24} />
        </div>

        <div className="flex justify-between items-end mt-3">
          <h1 className='font-bold text-3xl'>
            Applied Companies
          </h1>
          <span className="text-3xl font-bold text-white">{appliedCount}</span>
        </div>
      </div>

    </div>
  )
}

export default Data;