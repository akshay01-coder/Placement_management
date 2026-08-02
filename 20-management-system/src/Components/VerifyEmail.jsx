import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../api';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // 60-second resend timer state
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL params or location state
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email') || location.state?.email || '';
    setEmail(emailParam);
    if (!emailParam) {
      setErrorMsg('No email address provided for verification.');
    }
  }, [location]);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Email address is missing. Please try signing up again.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-otp', {
        email: email.trim(),
        otp: otp.trim()
      });

      setSuccessMsg(response.data.message || 'Email verified successfully!');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setErrorMsg(error.response?.data?.message || 'Verification failed. The OTP may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isTimerActive) return;

    setErrorMsg('');
    setSuccessMsg('');
    setResendLoading(true);

    try {
      const response = await api.post('/api/auth/resend-otp', {
        email: email.trim()
      });

      setSuccessMsg(response.data.message || 'A new verification OTP has been sent to your email.');
      setTimer(60);
      setIsTimerActive(true);
    } catch (error) {
      console.error('OTP Resend Error:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to resend verification OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1f] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[460px] bg-[#16162a]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Login
        </button>

        {/* Heading Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white">Verify Email</h1>
          <p className="text-gray-400 text-xs mt-1 px-4">
            We sent a secure 6-digit verification code to <span className="text-indigo-400 font-semibold">{email || 'your email'}</span>
          </p>
        </div>

        {/* Form Verification */}
        <form onSubmit={handleVerify} className="space-y-5">
          
          <div className="space-y-2">
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

          {/* Success / Error Messages */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-98"
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <span>Verify Code</span>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Didn't receive the verification code?
          </p>
          <button
            type="button"
            disabled={isTimerActive || resendLoading || !email}
            onClick={handleResend}
            className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 transition-colors cursor-pointer"
          >
            {resendLoading ? (
              'Resending...'
            ) : isTimerActive ? (
              `Resend OTP in ${timer}s`
            ) : (
              'Resend OTP Now'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
