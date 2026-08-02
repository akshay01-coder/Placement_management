import React, { useState } from 'react';
import { Send, Bell, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please provide both a title and a message.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/notifications/broadcast', {
        title: title.trim(),
        message: message.trim()
      });
      
      setSuccess(true);
      setTitle("");
      setMessage("");
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      alert(error.response?.data?.message || 'Failed to broadcast notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans text-white mt-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Bell className="text-indigo-400" size={36} /> Broadcast Message
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Send a real-time notification or announcement to all registered students
        </p>
      </div>

      {/* Success Alert Banner */}
      {success && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
          <CheckCircle2 size={24} />
          <div>
            <h4 className="font-bold">Broadcast Sent Successfully!</h4>
            <p className="text-xs">Students will see this alert in their notification center immediately.</p>
          </div>
        </div>
      )}

      {/* Broadcast Form Card */}
      <form onSubmit={handleBroadcast} className="bg-[#241A52] border border-white/10 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
            Notification Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Urgent Notice: CGPA Criteria Updated / Resume Upload Deadline"
            required
            disabled={loading}
            className="w-full bg-[#1F1744] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">
            Announcement Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the detailed notification message here..."
            required
            rows={6}
            disabled={loading}
            className="w-full bg-[#1F1744] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-90 active:scale-98 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-600/35 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          <span>{loading ? 'Broadcasting Alert...' : 'Send to All Students'}</span>
        </button>

      </form>

    </div>
  );
};

export default SendNotification;
