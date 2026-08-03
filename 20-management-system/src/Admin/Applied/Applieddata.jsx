import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Award,
  FileText,
} from 'lucide-react';
import api from '../../api';

const Applieddata = () => {
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

  const { id } = useParams();

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Loading...',
    appliedCount: 0,
    packageLpa: ''
  });
  const [companyRounds, setCompanyRounds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/api/applications/company/${id}`);
      setCompanyInfo({
        name: response.data.company.name,
        appliedCount: response.data.count,
        packageLpa: response.data.company.packageLpa,
        currentRoundIndex: response.data.company.currentRoundIndex || 0
      });
      setCompanyRounds(response.data.company.rounds || []);
      setApplications(response.data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company applications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
      );
      // Refresh top count banner
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update student status.');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#18122B] text-white p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Loading Applications...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18122B] text-white p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Applied Students</h1>
        <p className="text-gray-400 mt-1">
          View student applications for each company
        </p>
      </div>

      {/* Back Link */}
      <button
        onClick={() => navigate('/applied-students')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Companies
      </button>

      {/* Top Company Banner */}
      <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 mb-6 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{companyInfo.name}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {companyInfo.appliedCount} student(s) applied
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-400">
            {companyInfo.packageLpa}
          </span>
          <p className="text-gray-400 text-xs mt-1">Package</p>
        </div>
      </div>

      {/* Student Applications Cards List */}
      <div className="space-y-6">
        {applications.map((app) => {
          const student = app.studentId;
          if (!student) return null;
          
          const initials = student.name
            ? student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            : 'ST';
          const appliedDate = new Date(app.appliedDate).toLocaleString();

          return (
            <div key={app._id} className="bg-[#2E236D] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Profile Section */}
                <div className="lg:col-span-5 flex items-center gap-4">
                  {student.profilePhoto ? (
                    <img
                      src={getFileUrl(student.profilePhoto)}
                      alt={student.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-indigo-400/30 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white">{student.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                      <Mail size={14} />
                      <span>{student.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Course: {student.course || 'N/A'}</p>
                  </div>
                </div>

                {/* CGPA Badge */}
                <div className="lg:col-span-2">
                  <div className="bg-[#1F1744] border border-white/5 rounded-xl p-3 flex flex-col justify-center items-center">
                    <div className="flex items-center gap-1 text-purple-400 text-xs mb-1">
                      <Award size={14} />
                      <span>CGPA</span>
                    </div>
                    <span className="text-white font-bold text-lg">
                      {student.cgpa}
                    </span>
                  </div>
                </div>

                {/* Resume PDF Section */}
                <div className="lg:col-span-2">
                  <div className="bg-[#1F1744] border border-white/5 rounded-xl p-3 flex flex-col justify-center items-start pl-4">
                    <div className="flex items-center gap-1 text-indigo-400 text-xs mb-1">
                      <FileText size={14} />
                      <span>Resume</span>
                    </div>
                    {student.resume ? (
                      <a
                        href={getFileUrl(student.resume)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline text-xs font-semibold cursor-pointer"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-500 text-xs font-medium">No Resume</span>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="lg:col-span-3">
                  <span className="text-xs text-gray-400 font-medium block mb-2">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills && student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!student.skills || student.skills.length === 0) && (
                      <span className="text-gray-500 text-xs">No skills listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Selection Pipeline Progress (Read-Only Info) */}
              {(() => {
                const rounds = companyRounds && companyRounds.length > 0
                  ? companyRounds.map(r => r.name)
                  : ["Resume Screen", "Aptitude Test", "Technical Interview", "HR Interview"];

                return (
                  <div className="mt-5 bg-[#1F1744] border border-white/5 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
                      Recruitment Pipeline Progress
                    </h4>
                    <div className="flex flex-wrap gap-3.5 items-center">
                      {rounds.map((roundName, index) => {
                        const isCompleted = index < (companyInfo.currentRoundIndex || 0);
                        const isCurrent = index === (companyInfo.currentRoundIndex || 0);
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                              isCompleted
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : isCurrent
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-white/5 border-white/10 text-gray-500'
                            }`}
                          >
                            <span>{isCompleted ? '✓' : index + 1}</span>
                            <span>{roundName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Status Actions & Applied Date */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <div className="text-gray-400">
                  Applied on: {appliedDate}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-300">
                    Status: 
                    <span className={`ml-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      app.status === 'Shortlisted' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'Shortlisted')}
                      className="bg-amber-600/30 hover:bg-amber-500 text-amber-200 border border-amber-500/20 px-2.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'Selected')}
                      className="bg-emerald-600/30 hover:bg-emerald-500 text-emerald-200 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                      className="bg-rose-600/30 hover:bg-rose-500 text-rose-200 border border-rose-500/20 px-2.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {applications.length === 0 && (
          <div className="bg-[#2E236D] border border-white/10 rounded-2xl p-12 text-center text-gray-400 font-medium">
            No student applications received yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Applieddata;