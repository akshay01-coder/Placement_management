import React from 'react'
import { LayoutDashboard, Plus, Building2, Users, LogOut, Bell } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/admin-login';
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-65 bg-[#0F172A] border-r border-white/10 shadow-2xl flex flex-col justify-between z-50">

      {/* Top Navigation Block */}
      <div>
        {/* Logo */}
        <Link to="/admin-dashboard" className="h-20 flex items-center justify-center border-b border-white/10 cursor-pointer px-4">
          <img
            src="/logo.png"
            alt="NextHire Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Menu */}
        <div className="px-4 py-6 space-y-3">

          {/* Dashboard - FIX: Changed path from '/' to '/admin-dashboard' */}
          <Link to="/admin-dashboard">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/admin-dashboard"
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </Link>

          {/* Add Company */}
          <Link to="/add-company">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/add-company"
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Plus size={20} />
              <span>Add Company</span>
            </button>
          </Link>

          {/* Manage Companies */}
          <Link to="/manage-companies">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/manage-companies" || location.pathname.startsWith("/manage/")
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Building2 size={20} />
              <span>Manage Companies</span>
            </button>
          </Link>

          {/* Applied Students */}
          <Link to="/applied-students">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/applied-students" || location.pathname.startsWith("/applied-students/")
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Users size={20} />
              <span>Applied Students</span>
            </button>
          </Link>

          {/* Registered Students */}
          <Link to="/registered-students">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/registered-students"
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Users size={20} />
              <span>Registered Students</span>
            </button>
          </Link>

          {/* Send Notification */}
          <Link to="/send-notification">
            <button
              className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                location.pathname === "/send-notification"
                  ? "bg-[#523DA9] text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Bell size={20} />
              <span>Send Notification</span>
            </button>
          </Link>

        </div>
      </div>

      {/* Bottom Profile & Logout Section */}
      <div className="p-4 space-y-4 border-t border-white/10">
        
        {/* Profile Card */}
        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            PO
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white font-bold text-sm truncate">
              Placement Officer
            </h4>
            <p className="text-gray-400 text-xs">
              Admin
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl text-sm font-medium transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  )
}

export default Sidebar