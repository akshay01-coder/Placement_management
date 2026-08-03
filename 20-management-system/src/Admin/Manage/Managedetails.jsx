import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Trash2,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  SquarePen,
  Check,
  X
} from 'lucide-react';
import api from '../../api';

const ManageDetails = ({ companies, onDeleteCompany }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find company
  const company = companies.find((c) => c.id === id);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("Tech");
  const [packageLpa, setPackageLpa] = useState("");
  const [location, setLocation] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const [minClass10Percentage, setMinClass10Percentage] = useState("");
  const [minClass12Percentage, setMinClass12Percentage] = useState("");

  const startEditing = () => {
    if (!company) return;
    
    // Parse dates safely
    let formattedVisitDate = "";
    let formattedLastDate = "";
    try {
      if (company.visitDate) {
        formattedVisitDate = new Date(company.visitDate).toISOString().split('T')[0];
      }
      if (company.lastDateToApply) {
        formattedLastDate = new Date(company.lastDateToApply).toISOString().split('T')[0];
      }
    } catch (e) {
      console.error(e);
    }

    setName(company.name || "");
    setDescription(company.description || "");
    setJobDescription(company.jobDescription || "");
    setRole(company.role || "");
    setCategory(company.category || "Tech");
    setPackageLpa(company.packageLpa || "");
    setLocation(company.location || "");
    setCgpa(company.cgpa || "");
    setVisitDate(formattedVisitDate);
    setLastDateToApply(formattedLastDate);
    setMinClass10Percentage(company.minClass10Percentage || "");
    setMinClass12Percentage(company.minClass12Percentage || "");
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !description || !jobDescription || !role || !packageLpa || !location || !visitDate || !cgpa || !lastDateToApply || !minClass10Percentage || !minClass12Percentage) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await api.put(`/api/companies/${id}`, {
        name,
        description,
        jobDescription,
        role,
        category,
        packageLpa,
        location,
        visitDate,
        cgpa: parseFloat(cgpa),
        lastDateToApply,
        minClass10Percentage: parseFloat(minClass10Percentage) || 0,
        minClass12Percentage: parseFloat(minClass12Percentage) || 0
      });

      alert("Company details updated successfully!");
      setIsEditing(false);
      window.location.reload(); // Refresh state
    } catch (error) {
      console.error('Error updating company:', error);
      alert(error.response?.data?.message || 'Failed to update company.');
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      onDeleteCompany(id);
      navigate('/manage-companies');
    }
  };

  const handleToggleRound = async (index, isCompleted) => {
    try {
      const newRoundIndex = isCompleted ? index : index + 1;
      await api.put(`/api/companies/${id}`, {
        currentRoundIndex: newRoundIndex
      });
      window.location.reload();
    } catch (error) {
      console.error('Error updating selection pipeline round:', error);
      alert('Failed to update selection pipeline round.');
    }
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-[#18122B] text-white p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <button
          onClick={() => navigate('/manage-companies')}
          className="bg-indigo-600 px-4 py-2 rounded-xl text-sm"
        >
          Back to Manage Companies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18122B] text-white p-8 font-sans pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate('/manage-companies')}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Back to Companies
      </button>

      {isEditing ? (
        /* ==================== EDIT FORM ==================== */
        <form onSubmit={handleSave} className="bg-[#2E236D] border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <SquarePen className="text-indigo-400" size={24} /> Edit Company Details
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer text-gray-300"
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer text-white"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none cursor-pointer"
              >
                <option value="Tech">Tech</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Package */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Package (LPA) *</label>
              <input
                type="text"
                value={packageLpa}
                onChange={(e) => setPackageLpa(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* CGPA */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Minimum CGPA *</label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "" && parseFloat(val) > 10) {
                    alert("Minimum CGPA cannot be more than 10");
                    return;
                  }
                  setCgpa(val);
                }}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Date of Visit */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Date of Visit *</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Last Date to Apply */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Last Date to Apply *</label>
              <input
                type="date"
                value={lastDateToApply}
                onChange={(e) => setLastDateToApply(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Min Class 10th Percentage */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Class 10th Cutoff (%) *</label>
              <input
                type="number"
                value={minClass10Percentage}
                onChange={(e) => setMinClass10Percentage(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Min Class 12th Percentage */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-semibold text-sm">Class 12th Cutoff (%) *</label>
              <input
                type="number"
                value={minClass12Percentage}
                onChange={(e) => setMinClass12Percentage(e.target.value)}
                required
                className="mt-2 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              />
            </div>

            {/* Job Description */}
            <div className="flex flex-col col-span-1 md:col-span-2">
              <label className="text-gray-300 font-semibold text-sm">Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={4}
                className="mt-2 pl-3 pt-2 bg-gray-800 rounded-xl border border-white/10 text-white outline-none resize-none focus:border-indigo-500 transition-colors"
                placeholder="Detailed job description..."
              />
            </div>

            {/* Description */}
            <div className="flex flex-col col-span-1 md:col-span-2">
              <label className="text-gray-300 font-semibold text-sm">About Company *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-2 pl-3 pt-2 bg-gray-800 rounded-xl border border-white/10 text-white outline-none resize-none focus:border-indigo-500 transition-colors"
                placeholder="Brief company overview..."
              />
            </div>
          </div>
        </form>
      ) : (
        /* ==================== DISPLAY VIEW ==================== */
        <>
          <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-8 mb-6 shadow-xl relative">
            <div className="flex justify-between items-start">
              <div className="flex gap-5 items-start">
                {/* Company Logo Icon */}
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-white shrink-0">
                  <Building2 size={32} />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">
                      {company.name}
                    </h1>
                    <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-0.5 rounded-full text-xs font-semibold">
                      {company.role}
                    </span>
                    <span className="bg-pink-500/20 text-pink-400 border border-pink-500/30 px-3 py-0.5 rounded-full text-xs font-semibold">
                      {company.category || 'Tech'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Job Description</h3>
                    <p className="text-gray-200 mt-1 text-sm max-w-2xl leading-relaxed whitespace-pre-line">
                      {company.jobDescription}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">About Company</h3>
                    <p className="text-gray-300 mt-1 text-sm max-w-2xl leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit Button */}
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/35 border border-indigo-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  <SquarePen size={16} />
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {/* Info Badges */}
            <div className="flex flex-wrap items-center gap-8 mt-8 pt-6 border-t border-white/10 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={18} className="text-violet-400" />
                <span>{company.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={18} className="text-indigo-400" />
                <span>Visit: {company.date}</span>
              </div>

              {company.lastDateToApply && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={18} className="text-pink-400" />
                  <span className="font-semibold text-rose-300">Last Date: {new Date(company.lastDateToApply).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <TrendingUp size={18} />
                <span>{company.packageLpa}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Eligibility Criteria */}
            <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                  <Award size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Eligibility Criteria
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#1F1744] border border-white/5 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Min CGPA</span>
                  <span className="text-white font-bold text-lg mt-1">
                    {company.cgpa}
                  </span>
                </div>
                <div className="bg-[#1F1744] border border-white/5 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Class 10 Min</span>
                  <span className="text-white font-bold text-lg mt-1">
                    {company.minClass10Percentage ? `${company.minClass10Percentage}%` : 'N/A'}
                  </span>
                </div>
                <div className="bg-[#1F1744] border border-white/5 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Class 12 Min</span>
                  <span className="text-white font-bold text-lg mt-1">
                    {company.minClass12Percentage ? `${company.minClass12Percentage}%` : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-3">
                  Required Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {company.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Eligible Courses */}
            <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Eligible Courses</h2>
              </div>

              <div className="bg-[#1F1744] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <span className="text-white font-semibold text-sm">
                  {company.courses?.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Selection Rounds Section */}
          <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Selection Rounds</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {company.rounds?.map((round, index) => {
                const isCompleted = index < (company.currentRoundIndex || 0);
                return (
                  <div
                    key={round.id}
                    onClick={() => handleToggleRound(index, isCompleted)}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer select-none transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#1F1744] border-white/5 text-white hover:border-indigo-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        {round.id}
                      </div>
                      <span className="font-semibold text-sm">
                        {round.name}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      readOnly
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-500 cursor-pointer pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Status Banner */}
          <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              Application Status
            </h2>
            <p className="text-gray-400 text-sm">
              {company.appliedStudentsCount} student(s) have applied to this company
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDetails;
