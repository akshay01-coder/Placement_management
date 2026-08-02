import React from 'react'
import { Building2 } from 'lucide-react';

const Recent = ({ companies = [] }) => {

  return (
    <div className="mt-8 h-[520px] bg-[#241A52] border border-white/10 rounded-2xl flex flex-col">

      
      <h1 className="text-white text-xl font-bold px-5 pt-5">
        Recently Added Companies
      </h1>

     
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-4">

        {companies.map((company, index) => (

          <div
            key={index}
            className="flex items-center bg-[#2E236D] rounded-xl border border-white/10 px-4 py-3 hover:-translate-y-1 hover:shadow-[0_8px_18px_rgba(139,92,246,0.30)] transition-all duration-300 cursor-pointer"
          >

            
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl">
              <Building2 size={24} className="text-white" />
            </div>

          
            <div className="ml-4">
              <h1 className="text-white text-lg font-semibold">
                {company.name}
              </h1>

              <div className="flex items-center gap-2 mt-1">

                <span className="px-2 py-0.5 text-[11px] text-blue-300 bg-blue-500/20 border border-blue-400/20 rounded-full">
                  Tech
                </span>

                <span className="text-gray-400 text-sm">
                  {company.location}
                </span>

              </div>
            </div>

           
            <div className="ml-auto text-right">

              <h1 className="text-green-400 text-lg font-bold">
                {company.package}
              </h1>

              <p className="text-gray-400 text-xs mt-1">
                {company.date}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Recent