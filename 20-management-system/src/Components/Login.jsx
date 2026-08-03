import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';
import api from '../api';

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Student Signup specific states
  const [name, setName] = useState('');
  const [course, setCourse] = useState('BTech');
  const [department, setDepartment] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState('');

  // Inline OTP states
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpTimer]);

  const handleSendOTP = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!email) {
      setErrorMessage('Please enter your email address to receive the OTP.');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await api.post('/api/auth/send-otp', { identifier: email.trim() });
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMessage(response.data.message || 'OTP verification code sent successfully!');
    } catch (error) {
      console.error('OTP Send error:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const loginId = email.trim();
    if (!loginId || !password) {
      setErrorMessage('Please enter both your credentials (email/mobile) and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email: loginId, password });
      const { token, user } = response.data;

      // Restrict Admins from logging in through Student Portal
      if (user.role === 'admin') {
        setErrorMessage('Admins must log in through the Admin Portal.');
        setAuthLoading(false);
        return;
      }

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.name);

      if (onLoginSuccess) {
        onLoginSuccess(user.role);
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/student-dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 403 && error.response?.data?.isVerified === false) {
        // Automatically switch to verify mode for unverified accounts
        const unverifiedEmail = error.response.data.email;
        setEmail(unverifiedEmail);
        setIsSignUp(true);
        setOtpSent(true);
        setOtpTimer(60);
        setSuccessMessage('Your email is unverified. A new verification OTP code was dispatched.');
        api.post('/api/auth/send-otp', { identifier: unverifiedEmail }).catch(err => console.error(err));
        setAuthLoading(false);
        return;
      }
      setErrorMessage(error.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword || !otp) {
      setErrorMessage('Please fill in all required fields including the verification OTP.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setAuthLoading(true);
    try {
      await api.post('/api/auth/register', {
        name,
        email: email.trim(),
        phone: phone ? phone.trim() : undefined,
        password,
        course,
        department,
        cgpa: cgpa ? parseFloat(cgpa) : 0,
        skills,
        otp: otp.trim()
      });

      setSuccessMessage('Registration successful! You can now log in.');
      setIsSignUp(false);
      setOtp('');
      setConfirmPassword('');
      setOtpSent(false);
      setOtpTimer(0);
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!otpSent) {
        handleSendOTP();
      } else {
        handleSignUp(e);
      }
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[460px] bg-[#16162a]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <GraduationCap size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">SPMS</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">Smart Placement Management System</p>
        </div>

        {/* Toggle between Login and Signup */}
        <div className="flex bg-[#1e1e38] p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isSignUp ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isSignUp ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Register Student
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4" autoComplete="off">
          
          {/* LOGIN VIEW */}
          {!isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 ml-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                placeholder="Enter email address"
                required
                autoComplete="off"
                className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          )}

          {/* SIGNUP VIEW */}
          {isSignUp && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 ml-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  autoComplete="new-password"
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 ml-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                  placeholder="name@example.com"
                  required
                  autoComplete="new-password"
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 ml-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  autoComplete="new-password"
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </>
          )}

          {/* Password (common to both views) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-gray-300">Password *</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                placeholder="Enter password"
                required
                autoComplete="new-password"
                className="w-full bg-[#1e1e38] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Only for registration) */}
          {isSignUp && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-medium text-gray-300 ml-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(''); }}
                  placeholder="Confirm password"
                  required
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Student Profile (Only for registration) */}
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 ml-1">Course *</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                  >
                    <option value="BTech">BTech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="MTech">MTech</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 ml-1">CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "" && parseFloat(val) > 10) {
                        alert("CGPA cannot be more than 10");
                        return;
                      }
                      setCgpa(val);
                    }}
                    placeholder="e.g. 8.5"
                    required
                    className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 ml-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. CSE, IT"
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 ml-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, C++"
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              {/* Inline OTP Field and Send Trigger */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-purple-300">Email Verification OTP *</label>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || otpTimer > 0}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {otpLoading ? 'Sending...' : otpTimer > 0 ? `Resend in ${otpTimer}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && (
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    maxLength={6}
                    required
                    className="w-full bg-[#1e1e38] border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all font-mono tracking-widest text-center"
                  />
                )}
              </div>
            </>
          )}

          {errorMessage && (
            <p className="text-red-400 text-xs font-medium pl-1 animate-fade-in">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-green-400 text-xs font-medium pl-1 animate-fade-in">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-98 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} />
                <span>{otpSent ? 'Verify & Register' : 'Send OTP'}</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Redirect to Admin Login */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/admin-login')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold cursor-pointer"
          >
            Are you an Admin? Access Admin Portal here →
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;