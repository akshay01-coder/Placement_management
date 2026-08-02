
import React, { useState, useEffect } from 'react'
import { CircleCheckBig, BadgeCheck, BookOpen, MapPin, Calendar, TrendingUp, Building2, UsersRound, FileText, X } from 'lucide-react';
import api from '../../api';

const ViewApplyCards = ({ company }) => {

  const rounds = company.rounds && company.rounds.length > 0
    ? company.rounds.map(r => r.name)
    : [
      "Aptitude",
      "Group Discussion",
      "Technical Interview",
      "HR Interview",
      "Offer Letter"
    ];

  const [applied, setApplied] = useState(false);
  const [showJdModal, setShowJdModal] = useState(false);

  useEffect(() => {
    const checkAppliedStatus = async () => {
      try {
        const response = await api.get('/api/applications/my-applications');
        const alreadyApplied = response.data.applications.some(
          (app) => app.companyId._id === company.id || app.companyId === company.id
        );
        setApplied(alreadyApplied);
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };
    if (company && company.id) {
      checkAppliedStatus();
    }
  }, [company]);

  const handleApply = async () => {
    try {
      const response = await api.post(`/api/applications/apply/${company.id}`);
      setApplied(true);
      alert(response.data.message || '🎉 Application Submitted successfully!');
    } catch (error) {
      console.error('Error applying to company:', error);
      alert(error.response?.data?.message || 'Failed to submit application.');
    }
  };

  return (
    <div className='min-h-screen pb-10 w-250 ml-75 mt-8'>
      {applied && (
        <div className='bg-green-900/40 border border-green-500/30 h-28 w-242 ml-4 mt-3 rounded-2xl flex items-center'>
          <CircleCheckBig size={35} className='text-green-400 ml-4' />
          <div className='ml-5'>
            <h1 className='text-green-200 text-2xl font-bold'>
              Application Submitted!
            </h1>
            <p className='text-green-400 mt-1'>
              Your resume has been successfully submitted to this company drive.
            </p>
          </div>
        </div>
      )}

      <div className={`bg-white/5 border border-white/10 rounded-2xl w-242 py-6 min-h-[14rem] ml-4 ${applied ? "mt-5" : "mt-3"} flex justify-between items-center px-8`}>
        <div className="flex-1 pr-6">
          <div className='flex items-center gap-5'>
            <div className='bg-gradient-to-br from-purple-500 to-cyan-400 h-15 w-15 rounded-2xl flex items-center justify-center shrink-0'>
              <Building2 size={30} className='text-white' />
            </div>
            <div>
              <h1 className='text-white text-2xl font-bold'>
                {company.name}
              </h1>
              <div className='flex gap-3 mt-2'>
                <span className='bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold'>
                  {company.category || 'Tech'}
                </span>
                <span className='bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold'>
                  {company.status}
                </span>
              </div>
            </div>
          </div>

          <p className='text-gray-300 text-sm mt-5 leading-relaxed max-w-2xl text-justify break-words'>
            {company.description}
          </p>

          <div className='flex flex-wrap gap-x-12 gap-y-2 mt-6 text-sm'>
            <span className='text-gray-400 flex items-center gap-2'>
              <MapPin size={18} className="text-violet-400" /> {company.location}
            </span>

            <span className='text-cyan-400 flex items-center gap-2'>
              <Calendar size={18} /> Visit Date: {company.date}
            </span>

            {company.lastDateToApply && (
              <span className='text-rose-400 flex items-center gap-2 font-bold animate-pulse'>
                <Calendar size={18} /> Apply By: {new Date(company.lastDateToApply).toLocaleDateString()}
              </span>
            )}

            <span className='text-green-400 font-bold flex items-center gap-2'>
              <TrendingUp size={18} /> {company.packageLpa || company.package || "N/A"}
            </span>
          </div>
        </div>

        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const deadline = company.lastDateToApply ? new Date(company.lastDateToApply) : null;
          if (deadline) {
            deadline.setHours(0, 0, 0, 0);
          }
          const isDeadlinePassed = deadline && today > deadline;

          return (
            <div className="flex flex-col gap-3 shrink-0 items-stretch">
              <button
                onClick={() => setShowJdModal(true)}
                className="flex items-center justify-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 hover:text-white border border-indigo-500/35 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer"
              >
                <FileText size={16} /> Job Description
              </button>
              <button
                onClick={handleApply}
                disabled={applied || isDeadlinePassed}
                className='bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-bold px-10 py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-center'
              >
                {applied ? "Applied ✓" : isDeadlinePassed ? "Closed ⏳" : "Apply Now"}
              </button>
            </div>
          );
        })()}
      </div>

      {/* Bottom Cards */}
      <div className='flex gap-5 mt-5 ml-4'>
        {/* Eligibility Criteria */}
        <div className='bg-white/5 border border-white/10 rounded-2xl w-118 min-h-[22rem] p-5 pb-6 flex flex-col justify-between'>
          <div>
            <div className='flex items-center gap-3'>
              <div className='bg-purple-500/20 p-3 rounded-xl'>
                <BadgeCheck size={22} className='text-purple-400' />
              </div>
              <h1 className='text-white text-xl font-bold'>
                Eligibility Criteria
              </h1>
            </div>

            <div className='grid grid-cols-3 gap-2 mt-6'>
              <div className='bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5'>
                <h1 className='text-gray-400 text-[9px] uppercase font-bold tracking-wider'>
                  Min CGPA
                </h1>
                <h1 className='text-green-400 text-lg font-bold mt-1.5'>
                  {company.cgpa}
                </h1>
              </div>

              <div className='bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5'>
                <h1 className='text-gray-400 text-[9px] uppercase font-bold tracking-wider'>
                  Class 10th
                </h1>
                <h1 className='text-purple-300 text-lg font-bold mt-1.5'>
                  {company.minClass10Percentage ? `${company.minClass10Percentage}%` : 'N/A'}
                </h1>
              </div>

              <div className='bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5'>
                <h1 className='text-gray-400 text-[9px] uppercase font-bold tracking-wider'>
                  Class 12th
                </h1>
                <h1 className='text-purple-300 text-lg font-bold mt-1.5'>
                  {company.minClass12Percentage ? `${company.minClass12Percentage}%` : 'N/A'}
                </h1>
              </div>
            </div>
          </div>

          <div className='bg-white/5 rounded-xl mt-4 p-4'>
            <h1 className='text-gray-400 mb-3 text-sm font-semibold'>
              Required Skills
            </h1>
            <div className='flex flex-wrap gap-2.5 max-h-24 overflow-y-auto pr-1'>
              {company.skills && company.skills.length > 0 ? (
                company.skills.map((skill, index) => (
                  <span key={index} className='bg-green-500/10 border border-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold'>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Eligible Courses */}
        <div className='bg-white/5 border border-white/10 rounded-2xl w-118 min-h-[22rem] p-5 pb-6 flex flex-col'>
          <div className='flex items-center gap-3'>
            <div className='bg-cyan-500/20 p-3 rounded-xl'>
              <BookOpen size={22} className='text-cyan-400' />
            </div>
            <h1 className='text-white text-xl font-bold'>
              Eligible Courses
            </h1>
          </div>

          <div className='space-y-2.5 mt-6 max-h-56 overflow-y-auto pr-1'>
            {company.courses && company.courses.length > 0 ? (
              company.courses.map((course, index) => (
                <div key={index} className='bg-white/5 rounded-xl h-11 flex items-center px-5 border border-white/5'>
                  <CircleCheckBig size={14} className='text-green-400 mr-3 shrink-0' />
                  <h1 className='text-white font-semibold text-sm'>
                    {course}
                  </h1>
                </div>
              ))
            ) : (
              <div className='bg-white/5 rounded-xl h-11 flex items-center px-5 text-gray-500 text-xs'>
                No eligible courses specified
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Rounds */}
      <div className='bg-white/5 w-240 min-h-[10rem] pb-5 mt-6 ml-4 rounded-2xl border border-white/10'>
        <div className='flex items-center gap-3 mt-4 ml-4'>
          <div className='bg-purple-500/20 p-3 rounded-xl'>
            <UsersRound size={22} className='text-purple-400' />
          </div>
          <h1 className='text-white text-xl font-bold'>
            Selection Rounds
          </h1>
        </div>

        <div className='flex gap-3 ml-4 mt-4 flex-wrap'>
          {rounds.map((round, index) => (
            <div
              key={index}
              className='bg-white/5 border border-white/10 h-12 px-4 rounded-xl flex items-center hover:bg-white/10 transition-all duration-300'
            >
              <span className='flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs'>
                {index + 1}
              </span>
              <h1 className='ml-3 text-white font-semibold text-sm whitespace-nowrap'>
                {round}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* JD Modal Overlay */}
      {showJdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-[#150F2E]/95 border border-purple-500/20 w-full max-w-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(139,92,246,0.3)] relative max-h-[80vh] flex flex-col animate-fadeIn">
            
            {/* Close Button */}
            <button
              onClick={() => setShowJdModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold tracking-wide">{company.name} - Job Description</h2>
                <p className="text-purple-300 text-xs mt-0.5">Role Offered: {company.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto mt-6 pr-2 text-gray-200 text-sm leading-relaxed whitespace-pre-line text-justify min-h-0 select-text">
              {company.jobDescription || 'No job description provided.'}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowJdModal(false)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewApplyCards




