import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Search, User, Bell, LogOut, FileText } from 'lucide-react'

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout Handler Function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/student-dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Upcoming Companies', path: '/upcoming', icon: <Building2 size={18} /> },
    { name: 'Find Match', path: '/findmatch', icon: <Search size={18} /> },
    { name: 'Applied Companies', path: '/applied-companies', icon: <FileText size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  return (
    <div className="h-16 bg-[#0F172A] border-b border-white/10 px-6 flex items-center justify-between shadow-xl">
      
      {/* Left: Logo Section */}
      <Link to="/student-dashboard" className="flex items-center">
        <img
          className="h-10 w-auto object-contain"
          src="/logo.png"
          alt="NextHire Logo"
        />
      </Link>

      {/* Middle: Navigation Links */}
      <div className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className="active:scale-95 transition-transform">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-[#523DA9] text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right: Notification, Profile & Logout */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Link to="/notifications" className="relative active:scale-95">
          <div className={`p-2 rounded-xl transition-all cursor-pointer ${
            location.pathname === '/notifications' ? 'bg-[#523DA9] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}>
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </div>
        </Link>

        {/* User Profile Badge */}
        <Link to="/profile" className="active:scale-95">
          <div className="flex items-center gap-2.5 bg-[#1E293B] border border-white/10 hover:border-violet-500/40 px-3 py-1 rounded-2xl transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-violet-600 border border-violet-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {(localStorage.getItem('userName') || 'ST').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <h1 className="text-white text-sm font-semibold">
              {localStorage.getItem('userName') || 'Student'}
            </h1>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 px-3 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95 cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}

export default Navbar