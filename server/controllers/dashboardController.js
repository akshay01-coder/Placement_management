import Company from '../models/Company.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// @desc    Retrieve Admin Dashboard metrics and stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // 1. Total Companies count
    const totalCompanies = await Company.countDocuments();

    // 2. Total Students count
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 3. Total Applications count
    const totalApplications = await Application.countDocuments();

    // 4. Active Placements (Active drives count)
    const activePlacements = await Company.countDocuments({ status: 'Active' });

    // 5. Recent Companies (limit to 10)
    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // 6. Active Season Stats (Distinct applicants and applications)
    const distinctApplicants = await Application.distinct('studentId');
    const uniqueApplicantsCount = distinctApplicants.length;

    res.status(200).json({
      success: true,
      stats: {
        totalCompanies,
        totalStudents,
        totalApplications,
        activePlacements,
        uniqueApplicantsCount
      },
      recentCompanies
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats.' });
  }
};
