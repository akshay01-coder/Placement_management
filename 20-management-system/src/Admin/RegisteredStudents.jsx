import React, { useState, useEffect } from 'react';
import { Users, FileText, Trash2, ShieldAlert, Eye, GraduationCap, MapPin } from 'lucide-react';
import api from '../api';

const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/auth/admin/students');
      setStudents(res.data.students || []);
    } catch (error) {
      console.error('Error fetching registered students:', error);
      alert('Failed to retrieve registered students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/auth/admin/students/${deleteConfirmId}`);
      setStudents(students.filter(s => s._id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users size={28} className="text-purple-400" /> Registered Students
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage student registrations, inspect credentials, and view uploaded academic documents.
          </p>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-2xl px-4 py-2 text-xs font-semibold text-purple-300">
          Total: {students.length} Student(s)
        </div>
      </div>

      {/* Main Student Grid/Table */}
      {loading ? (
        <div className="bg-[#1e1a3a]/80 border border-purple-500/10 rounded-3xl p-12 text-center">
          <p className="text-purple-300 text-sm font-semibold animate-pulse">Loading student directory...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-[#1e1a3a]/80 border border-purple-500/10 rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-sm font-semibold">No registered students found in database.</p>
        </div>
      ) : (
        <div className="bg-[#16122a] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1f1a38] border-b border-purple-500/10 text-purple-300 text-xs font-bold tracking-wider">
                  <th className="p-4 pl-6">Student Info</th>
                  <th className="p-4">DB Credentials</th>
                  <th className="p-4">Academic Details</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Resume</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/5 text-sm">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-purple-950/10 transition-colors">
                    {/* Student Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{student.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{student.phone || 'No phone added'}</p>
                        </div>
                      </div>
                    </td>

                    {/* DB Credentials */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-semibold">ID / EMAIL:</span>
                          <span className="text-xs text-purple-200 truncate max-w-[200px]">{student.email}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-semibold">HASHED PASS:</span>
                          <span className="text-xs text-gray-400 font-mono select-all truncate max-w-[200px]" title={student.password}>
                            {student.password || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Academic Details */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-xs text-gray-300 font-semibold">
                          Course: <span className="text-purple-300 font-normal">{student.course || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-300 font-semibold">
                          Dept: <span className="text-purple-300 font-normal">{student.department || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-300 font-semibold">
                          CGPA: <span className="text-green-400 font-bold">{student.cgpa || '0.0'}</span>
                        </p>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {student.skills && student.skills.length > 0 ? (
                          student.skills.map((skill, idx) => (
                            <span key={idx} className="bg-purple-900/30 border border-purple-500/20 text-purple-200 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </td>

                    {/* Resume */}
                    <td className="p-4">
                      {student.resume ? (
                        <a
                          href={`http://localhost:5000${student.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 w-fit transition-all"
                        >
                          <FileText size={14} /> View PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">No resume</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 hover:bg-purple-500/10 rounded-xl text-purple-400 hover:text-purple-300 transition-all cursor-pointer inline-flex mr-1.5"
                        title="View Full Profile & Marksheets"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(student._id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer inline-flex"
                        title="Delete Student Account"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-[#16122a] border border-red-500/30 rounded-3xl p-6 w-[400px] shadow-2xl animate-fade-in text-white">
            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <ShieldAlert size={20} /> Remove Student Account
            </h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to permanently delete this student account from the system? Their profiles and job applications will be permanently cleared.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4 text-white">
          <div className="bg-[#16122a] border border-purple-500/30 rounded-3xl p-6 w-[650px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative text-left">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <Eye size={24} /> Student Profile Details
            </h2>

            {/* General Info */}
            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-md">
                {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{selectedStudent.name}</h3>
                <p className="text-xs text-gray-400 mt-1">Course: <span className="text-purple-300 font-semibold">{selectedStudent.course || 'N/A'}</span> | Department: <span className="text-purple-300 font-semibold">{selectedStudent.department || 'N/A'}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">Email: <span className="text-purple-300 font-semibold">{selectedStudent.email}</span> | Phone: <span className="text-purple-300 font-semibold">{selectedStudent.phone || 'N/A'}</span></p>
              </div>
            </div>

            {/* Educational Details */}
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <GraduationCap size={16} /> Class 10th Details
                </h4>
                {selectedStudent.educationalDetails?.class10 ? (
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <p className="text-gray-400">School Name: <span className="text-white font-medium">{selectedStudent.educationalDetails.class10.schoolName || 'N/A'}</span></p>
                    <p className="text-gray-400">Board Name: <span className="text-white font-medium">{selectedStudent.educationalDetails.class10.board || 'N/A'}</span></p>
                    <p className="text-gray-400">Percentage: <span className="text-green-400 font-bold">{selectedStudent.educationalDetails.class10.percentage ? `${selectedStudent.educationalDetails.class10.percentage}%` : 'N/A'}</span></p>
                    <p className="text-gray-400">Location: <span className="text-white font-medium">{selectedStudent.educationalDetails.class10.location || 'N/A'}</span></p>
                    <div className="col-span-2 mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">Marksheet Document:</span>
                      {selectedStudent.educationalDetails.class10.marksheet ? (
                        <a
                          href={`http://localhost:5000${selectedStudent.educationalDetails.class10.marksheet}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold"
                        >
                          View 10th Marksheet
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">Not Uploaded</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No Class 10th details entered.</p>
                )}
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <GraduationCap size={16} /> Class 12th Details
                </h4>
                {selectedStudent.educationalDetails?.class12 ? (
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <p className="text-gray-400">School Name: <span className="text-white font-medium">{selectedStudent.educationalDetails.class12.schoolName || 'N/A'}</span></p>
                    <p className="text-gray-400">Board Name: <span className="text-white font-medium">{selectedStudent.educationalDetails.class12.board || 'N/A'}</span></p>
                    <p className="text-gray-400">Percentage: <span className="text-green-400 font-bold">{selectedStudent.educationalDetails.class12.percentage ? `${selectedStudent.educationalDetails.class12.percentage}%` : 'N/A'}</span></p>
                    <p className="text-gray-400">Location: <span className="text-white font-medium">{selectedStudent.educationalDetails.class12.location || 'N/A'}</span></p>
                    <div className="col-span-2 mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">Marksheet Document:</span>
                      {selectedStudent.educationalDetails.class12.marksheet ? (
                        <a
                          href={`http://localhost:5000${selectedStudent.educationalDetails.class12.marksheet}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-3 py-1 rounded-lg text-[10px] font-bold"
                        >
                          View 12th Marksheet
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">Not Uploaded</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No Class 12th details entered.</p>
                )}
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <GraduationCap size={16} /> College Semester Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <p className="text-gray-400">Total Backlogs: <span className="text-white font-bold">{selectedStudent.educationalDetails?.college?.totalBacklogs || '0'}</span></p>
                  <p className="text-gray-400">Ongoing Backlogs: <span className="text-red-400 font-bold">{selectedStudent.educationalDetails?.college?.ongoingBacklogs || '0'}</span></p>
                </div>

                <label className="text-[10px] text-gray-400 font-semibold block mb-2">SEMESTER GRADES & DOCUMENT LINKS</label>
                {selectedStudent.educationalDetails?.college?.semesters && selectedStudent.educationalDetails.college.semesters.length > 0 ? (
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                    {selectedStudent.educationalDetails.college.semesters.map((sem) => (
                      <div key={sem.semesterNumber} className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
                        <span className="font-semibold text-gray-300">Semester {sem.semesterNumber}</span>
                        <div className="flex items-center gap-4">
                          <p className="text-gray-400">SGPA: <span className="text-green-400 font-bold">{sem.sgpa || '0.0'}</span></p>
                          {sem.marksheet ? (
                            <a
                              href={`http://localhost:5000${sem.marksheet}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold"
                            >
                              View Marksheet
                            </a>
                          ) : (
                            <span className="text-[9px] text-gray-500 italic text-right">No File</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No semester details recorded.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisteredStudents;
