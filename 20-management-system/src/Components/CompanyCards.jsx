import React from 'react'
import { Link } from "react-router-dom";

const CompanyCards = ({ companies = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-10 ml-30 mt-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-indigo-950/60 h-65 w-95 rounded-2xl p-6 border border-white/10 flex flex-col justify-between animate-pulse">
            <div className="space-y-3">
              <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
              <div className="h-4 bg-white/10 rounded-full w-1/4"></div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between"><div className="h-3 bg-white/10 rounded w-1/3"></div><div className="h-3 bg-white/10 rounded w-1/4"></div></div>
              <div className="flex justify-between"><div className="h-3 bg-white/10 rounded w-1/3"></div><div className="h-3 bg-white/10 rounded w-1/4"></div></div>
              <div className="flex justify-between"><div className="h-3 bg-white/10 rounded w-1/3"></div><div className="h-3 bg-white/10 rounded w-1/4"></div></div>
            </div>
            <div className="h-10 bg-white/10 rounded-2xl mt-4 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-10 ml-30 mt-8">

      {companies.map((company) => (

        <div
          key={company.name}
          className="bg-indigo-950 h-65 w-95 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-[10px_10px_25px_rgba(99,102,241,0.5)]"
        >

          <div className="ml-6 mt-4">

            <h1 className="text-2xl font-bold text-white">
              {company.name}
            </h1>

            <span className="bg-blue-600 text-blue-100 text-xs font-semibold rounded-3xl min-h-6 px-3 py-1 inline-flex items-center justify-center mt-2 w-max">
              {company.role}
            </span>

            <div className="flex justify-between items-center mt-5 mr-6">
              <h1 className="text-gray-300">
                CGPA Required
              </h1>

              <h1 className="text-gray-300 font-semibold">
                {company.cgpa}
              </h1>
            </div>

            <div className="flex justify-between items-center mt-3 mr-6">
              <h1 className="text-gray-300">
                Package
              </h1>

              <h1 className="text-green-600 font-bold">
                {company.packageLpa}
              </h1>
            </div>

            <div className="flex justify-between items-center mt-3 mr-6">
              <h1 className="text-gray-300">
                Location
              </h1>

              <h1 className="text-gray-300">
                {company.location}
              </h1>
            </div>

           <Link
            to="/viewapply"
               state={{ company }}
              className="flex items-center justify-center w-83 h-10 mt-3 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 hover:ring-2 hover:ring-purple-400 hover:brightness-110 active:scale-95 transition-all duration-300"
              >
             <span className="text-white font-medium">
               Apply Now
            </span>
          </Link>

          </div>

        </div>

      ))}

    </div>
  )
}

export default CompanyCards