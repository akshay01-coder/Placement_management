import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, MapPin, Calendar, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';
import api from '../../api';

const AppliedCompanies = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/api/applications/my-applications');
        setApplications(response.data.applications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applied companies progress:', error);
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={14} /> Selected
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <Award size={14} /> Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <h2 className="text-xl font-semibold">Loading your applications...</h2>
      </div>
    );
  }

  const validApplications = (applications || []).filter(app => app && app.companyId);

  return (
    <div className="max-w-6xl mx-auto px-6 mt-10">
      
      {/* Header Title */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Applied Companies</h1>
        <p className="text-gray-400 mt-2">Track your application review status and selection progress</p>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validApplications.map((app) => {
          const company = app.companyId;
          if (!company) return null;

          const appliedDate = new Date(app.appliedDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Fallback selection rounds if not configured in backend
          const rounds = company.rounds && company.rounds.length > 0
            ? company.rounds.map(r => r.name)
            : ["Resume Screen", "Aptitude Test", "Technical Interview", "HR Interview"];

          return (
            <div
              key={app._id}
              className="bg-indigo-950 border border-white/10 rounded-2xl p-6 hover:shadow-[-5px_5px_20px_rgba(96,165,250,0.2)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                
                {/* Top Section: Name & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-200">{company.name}</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{company.role}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                {/* Company Details Row */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 bg-white/5 rounded-xl p-3 mb-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-500">PACKAGE</span>
                    <span className="text-green-400 font-bold flex items-center gap-1">
                      <TrendingUp size={12} /> {company.packageLpa}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-500">LOCATION</span>
                    <span className="text-white flex items-center gap-1">
                      <MapPin size={12} /> {company.location}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-500">APPLIED DATE</span>
                    <span className="text-white flex items-center gap-1">
                      <Calendar size={12} /> {appliedDate}
                    </span>
                  </div>
                </div>

                {/* Selection Timeline Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Selection Pipeline
                  </h4>

                  <div className="flex items-center justify-between relative mt-2 px-2">
                    {/* Background Progress Connector Line */}
                    <div className="absolute left-6 right-6 top-[10px] h-[2px] bg-white/10 -z-10"></div>

                    {rounds.map((roundName, index) => {
                      const completedCount = company.currentRoundIndex || 0;
                      let isCompleted = index < completedCount;
                      let isCurrent = index === completedCount;
                      let isRejectedRound = app.status === 'Rejected' && index === completedCount;

                      if (app.status === 'Selected') {
                        isCompleted = true;
                        isCurrent = false;
                      }

                      return (
                        <div key={index} className="flex flex-col items-center flex-1 relative group">
                          {/* Round Node Circle */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : isRejectedRound
                                ? 'bg-rose-500 border-rose-400 text-white'
                                : isCurrent
                                ? 'bg-amber-500 border-amber-400 text-white animate-pulse'
                                : 'bg-indigo-950 border-white/20 text-gray-500'
                            }`}
                          >
                            {isCompleted ? '✓' : isRejectedRound ? '✗' : index + 1}
                          </div>
                          
                          {/* Round Name Tooltip/Subtitle */}
                          <span className="text-[10px] text-gray-400 mt-2 font-medium text-center truncate max-w-[70px] group-hover:text-white transition-colors">
                            {roundName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Status Message Footer */}
              <div className="border-t border-white/5 pt-4 mt-4 text-xs text-gray-400 flex items-center justify-between">
                <span>
                  {app.status === 'Selected' && '🎉 Congratulations! You have received an offer.'}
                  {app.status === 'Shortlisted' && '👍 You are shortlisted for the next rounds.'}
                  {app.status === 'Rejected' && '❌ Better luck next time.'}
                  {app.status === 'Pending' && '⏳ Application is under review.'}
                </span>
                <span className="text-gray-500">ID: {app._id.slice(-6).toUpperCase()}</span>
              </div>

            </div>
          );
        })}

        {validApplications.length === 0 && (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-12 text-center shadow-xl backdrop-blur-xl">
            <div className="w-56 h-56 mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-500">
              <img
                src="/empty_state.png"
                alt="No Applications"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(147,51,234,0.25)]"
              />
            </div>
            
            <h3 className="text-white text-2xl font-extrabold mb-3 tracking-wide bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              No Active Applications
            </h3>
            
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven't applied to any placement drives yet. Build your profile, explore current openings, and start your career journey today!
            </p>

            <button
              onClick={() => navigate('/upcoming')}
              className="bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Explore Placement Drives →
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AppliedCompanies;
