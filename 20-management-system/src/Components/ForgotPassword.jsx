import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertTriangle, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';
import api from '../api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-second resend timer state for recovery OTP
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const navigate = useNavigate();

  // Resend OTP timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startTimer = () => {
    setTimer(60);
    setIsTimerActive(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/forgot-password', { email: email.trim() });
      setSuccessMsg(response.data.message || 'Password reset OTP has been sent to your email.');
      setStep(2);
      startTimer();
    } catch (error) {
      console.error('Send Recovery OTP Error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to send password reset OTP. Make sure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp || otp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-forgot-otp', {
        email: email.trim(),
        otp: otp.trim()
      });

      setSuccessMsg(response.data.message || 'OTP verified successfully. You can now reset your password.');
      setStep(3);
    } catch (error) {
      console.error('Verify Recovery OTP Error:', error);
      setErrorMsg(error.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isTimerActive) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email: email.trim() });
      setSuccessMsg(response.data.message || 'A new password reset OTP has been sent.');
      startTimer();
    } catch (error) {
      console.error('Resend Recovery OTP Error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        password: password
      });

      setSuccessMsg(response.data.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (error) {
      console.error('Reset Password Error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[460px] bg-[#16162a]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Back Link */}
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
              setErrorMsg('');
              setSuccessMsg('');
            } else {
              navigate('/login');
            }
          }}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} />
          {step > 1 ? 'Go Back' : 'Back to Login'}
        </button>

        {/* Header Heading */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white">Reset Password</h1>
          <p className="text-gray-400 text-xs mt-1 px-4">
            {step === 1 && 'Enter your email address to receive a secure recovery verification code.'}
            {step === 2 && `We sent a password recovery code to ${email}`}
            {step === 3 && 'Create a strong, secure new password for your account.'}
          </p>
        </div>

        {/* Step 1: Input Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 ml-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-55 cursor-pointer active:scale-98"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Input OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 ml-1">Recovery OTP Code *</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(val);
                    setErrorMsg('');
                  }}
                  placeholder="Enter 6-Digit OTP"
                  required
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl px-4 py-3.5 text-center text-xl font-bold tracking-[0.4em] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
                />
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {successMsg && (
              <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl p-3">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-55 cursor-pointer active:scale-98"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Verify Code'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                disabled={isTimerActive || loading}
                onClick={handleResendOtp}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 transition-colors cursor-pointer"
              >
                {isTimerActive ? `Resend OTP in ${timer}s` : 'Resend OTP Code'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 ml-1">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="Min 6 characters"
                  required
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 ml-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="Repeat your password"
                  required
                  className="w-full bg-[#1e1e38] border border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl p-3">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-55 cursor-pointer active:scale-98"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Confirm Reset Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
