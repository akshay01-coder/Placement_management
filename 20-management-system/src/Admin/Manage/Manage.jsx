import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Building2 } from 'lucide-react';

const Manage = ({ companies, onDeleteCompany }) => {
  const navigate = useNavigate();

  // View Details Handler
  const handleViewDetails = (id) => {
    navigate(`/manage/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#18122B] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Companies</h1>
          <p className="text-gray-400 mt-1">
            View and manage all registered companies
          </p>
        </div>

        <button
          onClick={() => navigate('/add-company')}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-medium px-5 py-2.5 rounded-xl text-sm cursor-pointer shadow-lg shadow-indigo-600/30"
        >
          + Add Company
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#2E236D] border border-white/10 rounded-2xl overflow-hidden p-4 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-white/10">
              <th className="py-4 px-6 font-semibold">Company</th>
              <th className="py-4 px-6 font-semibold">Role</th>
              <th className="py-4 px-6 font-semibold">Package</th>
              <th className="py-4 px-6 font-semibold">Location</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-white/5 transition-colors group"
              >
                {/* Company Icon + Name + CGPA */}
                <td className="py-4 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      CGPA: {company.cgpa}
                    </div>
                  </div>
                </td>

                {/* Role Tag */}
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      company.role === 'Sales'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {company.role}
                  </span>
                </td>

                {/* Package */}
                <td className="py-4 px-6 font-semibold text-emerald-400">
                  {company.packageLpa}
                </td>

                {/* Location */}
                <td className="py-4 px-6 text-gray-300">{company.location}</td>

                {/* Date */}
                <td className="py-4 px-6 text-gray-300">{company.date}</td>

                {/* Action Buttons */}
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(company.id)}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 p-2 rounded-lg transition-all cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteCompany(company.id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 p-2 rounded-lg transition-all cursor-pointer"
                      title="Delete Company"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {companies.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-medium">
            No companies registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage;