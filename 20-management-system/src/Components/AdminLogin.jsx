import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Eye, EyeOff } from 'lucide-react';
import api from '../api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = adminId.trim();
    if (!trimmedId || !password) {
      setErrorMessage('Please enter both Admin ID and password.');
      return;
    }

    setLoading(true);
    try {
      // Send standard login request using the fixed credentials
      const response = await api.post('/api/auth/login', { 
        email: trimmedId, 
        password: password 
      });
      
      const { token, user } = response.data;

      // Restrict Students from logging in through Admin Portal
      if (user.role !== 'admin') {
        setErrorMessage('Access denied. This portal is restricted to administrators.');
        setLoading(false);
        return;
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.name);

      if (onLoginSuccess) {
        onLoginSuccess(user.role);
      }

      navigate('/admin-dashboard', { replace: true });
    } catch (error) {
      console.error('Admin Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d091f] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[460px] bg-[#16122a]/95 border border-purple-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">SPMS Admin</h1>
          <p className="text-purple-300/80 text-xs mt-1 font-medium">Smart Placement Management - Admin Portal</p>
        </div>

        {/* Info Box */}
        <div className="bg-purple-900/10 border border-purple-500/10 rounded-xl p-3 mb-5 text-center text-xs text-purple-300">
          Enter your official administrator credentials to log in.
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-purple-200 ml-1">Admin ID *</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => { setAdminId(e.target.value); setErrorMessage(''); }}
              placeholder="Enter Admin ID"
              required
              autoComplete="new-password"
              className="w-full bg-[#1e1a38] border border-purple-500/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-purple-200 ml-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                placeholder="Enter password"
                required
                autoComplete="new-password"
                className="w-full bg-[#1e1a38] border border-purple-500/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-xs font-medium pl-1 animate-fade-in">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-98 mt-4 disabled:opacity-50"
          >
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        {/* Redirect to Student Login */}
        <div className="mt-6 pt-5 border-t border-purple-500/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs text-purple-300 hover:text-purple-200 transition-colors font-semibold cursor-pointer"
          >
            Are you a Student? Go to Student Portal here →
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
