
import React, { useState, useEffect } from 'react'
import Recent from "./Recent";
import Season from './Season';
import api from '../../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalStudents: 0,
    totalApplications: 0,
    activePlacements: 0,
    uniqueApplicantsCount: 0
  });
  const [recentCompanies, setRecentCompanies] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        setStats(response.data.stats);
        
        const mapped = response.data.recentCompanies.map(c => ({
          name: c.name,
          location: c.location,
          package: c.packageLpa,
          date: new Date(c.visitDate).toLocaleDateString()
        }));
        setRecentCompanies(mapped);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>

     
      <div className="mt-2">
        <h1 className="text-white text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Manage placement activities and monitor progress
        </p>
      </div>

    

      <div className="grid grid-cols-4 gap-6 mt-8">

       

        <div className="bg-[#241A52] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(139,92,246,0.35)] cursor-pointer">

          <h2 className="text-gray-400 text-lg font-medium">
            Total Companies
          </h2>

          <h1 className="text-white text-5xl font-bold mt-5">
            {stats.totalCompanies}
          </h1>

        </div>

       

        <div className="bg-[#241A52] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(139,92,246,0.35)] cursor-pointer">

          <h2 className="text-gray-400 text-lg font-medium">
            Total Students
          </h2>

          <h1 className="text-white text-5xl font-bold mt-5">
            {stats.totalStudents}
          </h1>

        </div>

       

        <div className="bg-[#241A52] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(139,92,246,0.35)] cursor-pointer">

          <h2 className="text-gray-400 text-lg font-medium">
            Total Applications
          </h2>

          <h1 className="text-white text-5xl font-bold mt-5">
            {stats.totalApplications}
          </h1>

        </div>


        <div className="bg-[#241A52] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(139,92,246,0.35)] cursor-pointer">

          <h2 className="text-gray-400 text-lg font-medium">
            Active Placements
          </h2>

          <h1 className="text-white text-5xl font-bold mt-5">
            {stats.activePlacements}
          </h1>

        </div>

      </div>

      <Recent companies={recentCompanies} />
      <Season uniqueApplicantsCount={stats.uniqueApplicantsCount} totalApplications={stats.totalApplications} />

    </div>
  )
}

export default Dashboard;