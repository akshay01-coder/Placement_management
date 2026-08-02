import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api";

const FindmatchCompanies = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/api/students/match');
        setMatches(response.data.matches);
        setLoading(false);
      } catch (error) {
        console.error('Error loading matches:', error);
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white mt-10 text-xl font-bold">
        Analyzing your profile and matching with companies...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 ml-35 mt-2">
      {matches.map((item) => {
        const { company, matchPercentage, cgpaMeets, courseMeets, matchingSkills } = item;
        return (
          <div
            key={company._id}
            className="group bg-indigo-950 rounded-2xl h-90 w-150 flex items-start hover:-translate-y-2 hover:shadow-[12px_12px_35px_rgba(59,130,246,0.6)] transition-all duration-700"
          >
            <div className="h-28 w-28 ml-8 mt-20">
              <CircularProgressbar
                value={matchPercentage}
                text={`${matchPercentage}%`}
                styles={{
                  path: {
                    stroke: "#a855f7",
                    strokeLinecap: "round",
                  },
                  text: {
                    fill: "white",
                    fontSize: "27px",
                    fontWeight: "bold",
                  },
                }}
              />

              <h6 className="text-green-400 font-bold text-xs ml-2 mt-2">
                {matchPercentage >= 80 ? "Excellent Match" : matchPercentage >= 60 ? "Good Match" : "Average Match"}
              </h6>
            </div>

            <div className="text-white h-55 w-130 mt-10">
              <div className="flex gap-20">
                <h1 className="mt-1 ml-10 text-2xl font-bold group-hover:text-purple-400">
                  {company.name}
                </h1>

                <h1 className="mt-2 text-green-500 text-xl font-bold">
                  {company.packageLpa}
                </h1>
              </div>

              <div className="flex mt-2 ml-10">
                <h1 className="bg-gray-600 min-h-6 px-3 py-1 flex items-center justify-center text-blue-200 rounded-3xl text-xs border border-white/30 w-max">
                  {company.role}
                </h1>

                <h1 className="ml-4 text-gray-400">
                  {company.location}
                </h1>
              </div>

              <h5 className="mt-3 ml-10 text-gray-400">
                Why this matches:
              </h5>

              <div className="text-xs mt-2 ml-10 gap-5 flex">
                <div className={`flex items-center gap-2 rounded-2xl h-7 px-3 border border-white/30 ${cgpaMeets ? 'bg-purple-400 text-amber-100' : 'bg-rose-500/30 text-rose-300'}`}>
                  <TrendingUp size={16} />
                  <span>{cgpaMeets ? `CGPA meets requirement (${company.cgpa})` : `CGPA below cutoff (${company.cgpa})`}</span>
                </div>

                <div className="flex items-center gap-2 bg-purple-400 text-amber-100 rounded-2xl h-7 px-3 border border-white/30">
                  <TrendingUp size={16} />
                  <span>{matchingSkills.length}/{company.skills.length} skills match</span>
                </div>
              </div>

              <h1 className="text-gray-400 ml-10 mt-3">
                Matching Skills:
              </h1>

              <div className="flex flex-wrap gap-3 mt-2 ml-10">
                {matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-green-900 text-green-300 rounded-2xl px-3 flex items-center h-7 border border-white/30"
                  >
                    {skill}
                  </span>
                ))}
                {matchingSkills.length === 0 && (
                  <span className="text-gray-500 text-xs mt-1">No matching skills found</span>
                )}
              </div>

              <Link
                to="/viewapply"
                state={{ company: {
                  id: company._id,
                  name: company.name,
                  type: company.role,
                  role: company.role,
                  status: company.status,
                  location: company.location,
                  date: new Date(company.visitDate).toLocaleDateString(),
                  package: company.packageLpa,
                  cgpa: company.cgpa,
                  skills: company.skills,
                  courses: company.courses,
                  rounds: company.rounds
                } }}
              >
                <button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl px-4 py-2 mt-9 ml-28 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] active:scale-95 transition-all duration-300">
                  View & Apply
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FindmatchCompanies;