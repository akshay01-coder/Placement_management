import React from 'react'
import { TrendingUp } from 'lucide-react'

const Season = ({ uniqueApplicantsCount = 0, totalApplications = 0 }) => {
  return (
    <div className="h-22 w-302 mt-5 ml-1 rounded-2xl bg-violet-500/20 border border-violet-400/20 flex items-center justify-between px-5">

     
      <div>
        <h1 className="text-white text-xl font-bold">
          Placement Season Active
        </h1>

        <h3 className="text-violet-200 mt-1">
          {totalApplications} applications received from {uniqueApplicantsCount} students
        </h3>
      </div>

     
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
        <TrendingUp size={30} className="text-white" strokeWidth={2.5} />
      </div>

    </div>
  )
}

export default Season