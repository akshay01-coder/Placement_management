import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import api from '../../api';

const Applied = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/companies');
        const mapped = response.data.companies.map((c) => ({
          id: c._id,
          name: c.name,
          role: c.role,
          packageLpa: c.packageLpa,
          location: c.location,
          appliedCount: c.appliedStudentsCount || 0
        }));
        setCompanies(mapped);
      } catch (error) {
        console.error('Error fetching companies list:', error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-[#18122B] text-white p-8 font-sans">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Applied Students</h1>
        <p className="text-gray-400 mt-1">
          View student applications for each company
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-[#2E236D] border border-white/10 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between"
          >
            {/* Top Row: Icon & Applied Counter */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-white">
                <Building2 size={24} />
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
                <Users size={14} />
                <span>{company.appliedCount}</span>
              </div>
            </div>

            {/* Company Name */}
            <h2 className="text-xl font-bold text-white mb-3">
              {company.name}
            </h2>

            {/* Key-Value Details */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Role</span>
                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-0.5 rounded-full text-xs font-semibold">
                  {company.role}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Package</span>
                <span className="text-emerald-400 font-bold">
                  {company.packageLpa}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Location</span>
                <span className="text-gray-200 font-medium">
                  {company.location}
                </span>
              </div>
            </div>

            {/* View Applications Button */}
            <button
              onClick={() => navigate(`/applied-students/${company.id}`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-md cursor-pointer"
            >
              View Applications
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applied;