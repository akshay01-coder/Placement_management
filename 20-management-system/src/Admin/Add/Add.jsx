import React, { useState } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import api from '../../api';

const Add = ({ setCompanies }) => {
  // ==========================
  // States
  // ==========================

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [role, setRole] = useState("");
  const [category, setCategory] = useState("Tech");
  const [cgpa, setCgpa] = useState("");
  const [packageLPA, setPackageLPA] = useState("");
  const [location, setLocation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const [minClass10Percentage, setMinClass10Percentage] = useState("");
  const [minClass12Percentage, setMinClass12Percentage] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [courses, setCourses] = useState([]);
  const [rounds, setRounds] = useState([]);

  const [success, setSuccess] = useState(false);

  // ==========================
  // Arrays
  // ==========================

  const courseList = ["BTech", "BCA", "MCA", "MTech"];

  const roundList = [
    "Aptitude",
    "Technical",
    "HR",
    "Managerial",
    "Final Interview",
  ];

  // ==========================
  // Functions
  // ==========================

  const addSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((item) => item !== skill));
  };

  const toggleCourse = (course) => {
    if (courses.includes(course)) {
      setCourses(courses.filter((item) => item !== course));
    } else {
      setCourses([...courses, course]);
    }
  };

  const toggleRound = (round) => {
    if (rounds.includes(round)) {
      setRounds(rounds.filter((item) => item !== round));
    } else {
      setRounds([...rounds, round]);
    }
  };

  const addCompany = async () => {
    if (!companyName || !description || !jobDescription || !role || !packageLPA || !location || !visitDate || !cgpa || !lastDateToApply || !minClass10Percentage || !minClass12Percentage) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    try {
      const payload = {
        name: companyName,
        description: description,
        jobDescription: jobDescription,
        role: role,
        packageLpa: packageLPA,
        location: location,
        visitDate: visitDate,
        cgpa: parseFloat(cgpa),
        lastDateToApply: lastDateToApply,
        minClass10Percentage: parseFloat(minClass10Percentage) || 0,
        minClass12Percentage: parseFloat(minClass12Percentage) || 0,
        skills: skills,
        courses: courses,
        rounds: rounds.map((r, index) => ({ id: index + 1, name: r })),
        category: category
      };

      await api.post('/api/companies', payload);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Clear form fields
        setCompanyName("");
        setDescription("");
        setJobDescription("");
        setRole("");
        setCategory("Tech");
        setCgpa("");
        setPackageLPA("");
        setLocation("");
        setVisitDate("");
        setLastDateToApply("");
        setMinClass10Percentage("");
        setMinClass12Percentage("");
        setSkills([]);
        setCourses([]);
        setRounds([]);
        
        // Trigger companies state reload
        if (setCompanies) {
          window.location.reload();
        }
      }, 2000);
    } catch (error) {
      console.error('Error adding company:', error);
      alert(error.response?.data?.message || 'Failed to add company.');
    }
  };

  // ==========================
  // Success Screen
  // ==========================

  if (success) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-[#2E236D] rounded-3xl border border-white/10 w-[480px] h-[320px] flex flex-col justify-center items-center">
          <div className="h-28 w-28 rounded-full bg-green-500 flex justify-center items-center text-5xl text-white font-bold">
            ✓
          </div>
          <h1 className="text-white text-4xl font-bold mt-8 ml-10 text-xl">
            Company Added Successfully!
          </h1>
          <p className="text-gray-400 mt-3">Redirecting...</p>
        </div>
      </div>
    );
  }

  // ==========================
  // Main UI
  // ==========================

  return (
    <div className="pb-12">
      {/* Heading */}
      <div className="w-fit h-fit">
        <h1 className="text-white font-bold text-3xl ml-35 mt-8">
          Add New Company
        </h1>
        <h1 className="text-gray-400 ml-35 mt-3">
          Fill in the company details for placement drive
        </h1>
      </div>

      {/* Form */}
      <div className="ml-35 mt-8 w-220 bg-[#2E236D] rounded-2xl border border-white/10 p-6">
        {/* Company Name */}
        <div className="flex flex-col">
          <label className="text-white font-bold">Company Name *</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white placeholder:text-gray-400 text-sm outline-none focus:border-violet-500/30 focus:shadow-[0_0_8px_rgba(209,213,219,0.25)] transition-all duration-300"
            type="text"
            placeholder="e.g. Google, Microsoft"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col mt-5">
          <label className="text-white font-bold">Job Description *</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-2 pl-2 pt-2 bg-gray-800 h-24 rounded-xl border border-white/10 text-white placeholder:text-gray-400 text-sm outline-none focus:border-violet-500/30 focus:shadow-[0_0_8px_rgba(209,213,219,0.25)] resize-none transition-all duration-300"
            placeholder="Detailed Job Description (roles, responsibilities, requirements)..."
          ></textarea>
        </div>

        {/* Description */}
        <div className="flex flex-col mt-5">
          <label className="text-white font-bold">About Company *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 pl-2 pt-2 bg-gray-800 h-24 rounded-xl border border-white/10 text-white placeholder:text-gray-400 text-sm outline-none focus:border-violet-500/30 focus:shadow-[0_0_8px_rgba(209,213,219,0.25)] resize-none transition-all duration-300"
            placeholder="Brief Company Overview..."
          ></textarea>
        </div>

        {/* Placement Details */}
        <h1 className="text-white text-xl font-bold mt-8">
          Placement Details
        </h1>

        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* Role */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              placeholder="Software Engineer"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none cursor-pointer"
            >
              <option value="Tech">Tech</option>
              <option value="Sales">Sales</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Package */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Package (LPA)</label>
            <input
              value={packageLPA}
              onChange={(e) => setPackageLPA(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              placeholder="12"
            />
          </div>

          {/* CGPA */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Minimum CGPA</label>
            <input
              value={cgpa}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "" && parseFloat(val) > 10) {
                  alert("Minimum CGPA cannot be more than 10");
                  return;
                }
                setCgpa(val);
              }}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              placeholder="7.5"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              placeholder="Bangalore"
            />
          </div>

          {/* Date of Visit */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Date of Visit *</label>
            <div className="relative">
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="mt-2 pl-2 pr-10 bg-gray-800 h-10 w-full rounded-xl border border-white/10 text-white outline-none text-sm"
              />
              <CalendarDays
                size={20}
                className="absolute right-3 top-5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Last Date to Apply */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Last Date to Apply *</label>
            <div className="relative">
              <input
                type="date"
                value={lastDateToApply}
                onChange={(e) => setLastDateToApply(e.target.value)}
                className="mt-2 pl-2 pr-10 bg-gray-800 h-10 w-full rounded-xl border border-white/10 text-white outline-none text-sm"
              />
              <CalendarDays
                size={20}
                className="absolute right-3 top-5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Class 10 Cutoff */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Class 10th Cutoff (%) *</label>
            <input
              type="number"
              value={minClass10Percentage}
              onChange={(e) => setMinClass10Percentage(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none text-sm"
              placeholder="e.g. 60"
            />
          </div>

          {/* Class 12 Cutoff */}
          <div className="flex flex-col">
            <label className="text-white font-bold">Class 12th Cutoff (%) *</label>
            <input
              type="number"
              value={minClass12Percentage}
              onChange={(e) => setMinClass12Percentage(e.target.value)}
              className="mt-2 pl-2 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none text-sm"
              placeholder="e.g. 60"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h1 className="text-white text-xl font-bold">Required Skills</h1>
          <div className="flex gap-3 mt-4">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="flex-1 pl-3 bg-gray-800 h-10 rounded-xl border border-white/10 text-white outline-none"
              placeholder="React, Node.js..."
            />
            <button
              onClick={addSkill}
              className="bg-violet-600 hover:bg-violet-700 transition-all px-4 rounded-xl cursor-pointer"
            >
              <Plus className="text-white" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 px-4 py-2 rounded-full"
              >
                <span className="text-violet-200">{skill}</span>
                <button onClick={() => removeSkill(skill)}>
                  <X size={16} className="text-red-400 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Eligible Courses */}
        <div className="mt-8">
          <h1 className="text-white text-xl font-bold">Eligible Courses</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            {courseList.map((course, index) => (
              <button
                key={index}
                onClick={() => toggleCourse(course)}
                className={`px-5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  courses.includes(course)
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-gray-800 border-white/10 text-gray-300 hover:bg-violet-500/20"
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Rounds */}
        <div className="mt-8">
          <h1 className="text-white text-xl font-bold">Selection Rounds</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            {roundList.map((round, index) => (
              <button
                key={index}
                onClick={() => toggleRound(round)}
                className={`px-5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  rounds.includes(round)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-800 border-white/10 text-gray-300 hover:bg-indigo-500/20"
                }`}
              >
                {round}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={addCompany}
          className="mt-10 w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-bold hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer"
        >
          Add Company
        </button>
      </div>
    </div>
  );
};

export default Add;