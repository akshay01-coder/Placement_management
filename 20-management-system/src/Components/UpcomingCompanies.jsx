
import React from 'react'
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Link } from "react-router-dom";

const UpcomingCompanies = ({ companies = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-19 ml-40 mt-10">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-indigo-950/60 h-88 w-90 rounded-2xl p-6 border border-white/10 flex flex-col justify-between animate-pulse">
            <div className="space-y-3">
              <div className="h-7 bg-white/10 rounded-lg w-2/3"></div>
              <div className="flex justify-between"><div className="h-4 bg-white/10 rounded-full w-1/3"></div><div className="h-4 bg-white/10 rounded-full w-1/4"></div></div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
            <div className="bg-white/5 h-20 w-full rounded-2xl mt-4 p-3 space-y-2 border border-white/5">
              <div className="flex justify-between"><div className="h-3 bg-white/10 rounded w-1/4"></div><div className="h-3 bg-white/10 rounded w-1/6"></div></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-white/10 rounded-2xl mt-4 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-wrap gap-19 ml-40 mt-10'>

      {companies.map((company) => (

       <Link to="/viewapply"
          state={{ company }}
          key={company.name}
          className='group bg-indigo-950 h-88 w-90 rounded-2xl cursor-pointer hover:shadow-[-10px_10px_25px_rgba(96,165,250,0.45)] transition-all duration-500 hover:-translate-y-1 flex flex-col items-start'
        >

          <h1 className='text-blue-200 group-hover:text-purple-900 ml-5 mt-2 text-2xl font-bold'>
            {company.name}
          </h1>

          <div className='flex items-center justify-between w-80 ml-5 mt-2 h-9'>
            <span className='text-white text-sm font-semibold truncate whitespace-nowrap max-w-[180px]'>
              {company.role}
            </span>

            <span className='flex items-center justify-center bg-pink-500 rounded-2xl h-7 px-3 font-bold text-xs shrink-0'>
              {company.status || 'Active'}
            </span>
          </div>

          <div className='h-8 w-45 flex ml-4.5 text-gray-400'>
            <MapPin />
            <h1 className='ml-2 '>
              {company.location}
            </h1>
          </div>

          <div className='h-8 w-45 flex ml-4.5 text-gray-400'>
            <Calendar />
            <h1 className='ml-2 '>
              {company.date}
            </h1>
          </div>

          <div className='h-8 w-45 flex ml-4.5 text-gray-400'>
            <TrendingUp />
            <h1 className='ml-2'>
              {company.packageLpa}
            </h1>
          </div>

          <div className='bg-white/8 h-20 w-84 ml-3 rounded-2xl p-3 flex flex-col'>
            <div className='flex justify-between'>
              <h1 className='font-bold text-gray-400'>
                MIN CGPA
              </h1>

              <h1 className='font-bold text-gray-400'>
                {company.cgpa}
              </h1>
            </div>

            <div className='mt-2 flex items-start'>
              <h1 className='text-xs text-gray-400'>
                Skills: {Array.isArray(company.skills) ? company.skills.join(', ') : company.skills}
              </h1>
            </div>
          </div>

          <button className='bg-gradient-to-r active:scale-95 from-indigo-900 via-purple-900 to-indigo-700 hover:from-indigo-800 hover:via-purple-700 hover:to-violet-600 transition-all duration-300 h-10 w-80 ml-4.5 mt-4 flex items-center justify-center rounded-2xl '>
            <span className='text-white font-semibold'>
              Job Description
            </span>
          </button>

       </Link>

      ))}

    </div>
  )
}

export default UpcomingCompanies