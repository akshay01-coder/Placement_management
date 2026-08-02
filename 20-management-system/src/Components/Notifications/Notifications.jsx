import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Building2, AlertCircle, FileText, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react'
import api from '../../api'

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/notifications');
        const mapped = response.data.notifications.map(n => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          type: n.title.includes('Drive') ? 'company' : 'info',
          actionText: n.title.includes('Drive') ? 'Apply Now' : 'View Profile',
          link: n.title.includes('Drive') ? '/upcoming' : '/profile',
          unread: !n.readStatus,
          isApplied: false
        }));
        setNotifications(mapped);

        // Mark individual notifications as read when loaded
        if (response.data.notifications.some(n => !n.readStatus)) {
          await api.post('/api/notifications/read-all');
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleAction = async (item) => {
    // If it's a company drive notification, let's redirect them to upcoming drives to apply
    if (item.actionText === "Apply Now") {
      navigate('/upcoming');
    } else {
      navigate(item.link);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/read-all');
      setNotifications(notifications.map(item => ({ ...item, unread: false })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // Avoid expanding card when clicking delete
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-20 pt-10 font-sans text-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="text-purple-400" /> Notifications
            </h1>
            <p className="text-gray-400 text-sm mt-1">Stay updated with company visits, resume alerts, and interview schedules. Click any notification card to open/expand it.</p>
          </div>

          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-violet-300 cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={(e) => {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                  toggleExpand(item.id);
                }
              }}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-purple-500/50 ${
                item.unread
                  ? 'bg-[#1E1B4B]/80 border-purple-500/40 shadow-lg shadow-purple-950/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  {item.type === 'company' && (
                    <div className="bg-blue-500/20 text-blue-400 p-2.5 rounded-xl border border-blue-500/30">
                      <Building2 size={22} />
                    </div>
                  )}
                  {item.type === 'alert' && (
                    <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-xl border border-amber-500/30">
                      <AlertCircle size={22} />
                    </div>
                  )}
                  {item.type === 'success' && (
                    <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 size={22} />
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="bg-purple-500/20 text-purple-400 p-2.5 rounded-xl border border-purple-500/30">
                      <FileText size={22} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white text-base">{item.title}</h2>
                    {item.unread && (
                      <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
                    )}
                  </div>
                  <p className={`text-gray-300 text-sm mt-1 transition-all duration-300 ${
                    expandedId === item.id ? '' : 'line-clamp-1 text-ellipsis overflow-hidden'
                  }`}>
                    {item.message}
                  </p>
                  <span className="text-gray-500 text-xs mt-2 block">{item.time}</span>
                </div>
              </div>

              {/* Action Buttons & Delete */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button 
                  onClick={() => handleAction(item)}
                  disabled={item.isApplied}
                  className={`font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 ${
                    item.isApplied 
                      ? 'bg-emerald-600 text-white cursor-not-allowed opacity-80' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  <span>{item.actionText}</span>
                  {!item.isApplied && <ArrowRight size={14} />}
                </button>

                <button
                  onClick={(e) => handleDeleteNotification(item.id, e)}
                  className="p-2.5 bg-red-600/10 hover:bg-red-600/25 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                  title="Delete Notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Notifications