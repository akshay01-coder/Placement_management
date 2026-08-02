import Application from '../models/Application.js';
import Company from '../models/Company.js';
import User from '../models/User.js';

// @desc    Student applies to a company
// @route   POST /api/applications/apply/:companyId
// @access  Private/Student
export const applyToCompany = async (req, res) => {
  const { companyId } = req.params;
  const studentId = req.user._id;

  try {
    // 1. Fetch company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // 2. Fetch full student profile to check resume and constraints
    const student = await User.findById(studentId);
    if (!student.resume) {
      return res.status(400).json({
        success: false,
        message: 'Action Required: Please upload your resume in the Profile page before applying.'
      });
    }

    // 2.5 Verify Application Deadline
    if (company.lastDateToApply) {
      const today = new Date();
      const deadline = new Date(company.lastDateToApply);
      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      if (today > deadline) {
        return res.status(400).json({
          success: false,
          message: `Application Closed: The deadline to apply for this company drive was ${new Date(company.lastDateToApply).toLocaleDateString()}.`
        });
      }
    }

    // 3. Verify student eligibility - CGPA
    if (student.cgpa < company.cgpa) {
      return res.status(400).json({
        success: false,
        message: `Eligibility Cutoff: Your CGPA (${student.cgpa}) does not meet the minimum CGPA requirement (${company.cgpa}) of this company.`
      });
    }

    // 3.5 Verify class 10 & 12 cutoffs
    if (company.minClass10Percentage && company.minClass10Percentage > 0) {
      const student10th = student.educationalDetails?.class10?.percentage || 0;
      if (student10th < company.minClass10Percentage) {
        return res.status(400).json({
          success: false,
          message: `Eligibility Cutoff: Your Class 10th percentage (${student10th}%) does not meet the minimum Class 10th requirement (${company.minClass10Percentage}%) of this company.`
        });
      }
    }

    if (company.minClass12Percentage && company.minClass12Percentage > 0) {
      const student12th = student.educationalDetails?.class12?.percentage || 0;
      if (student12th < company.minClass12Percentage) {
        return res.status(400).json({
          success: false,
          message: `Eligibility Cutoff: Your Class 12th percentage (${student12th}%) does not meet the minimum Class 12th requirement (${company.minClass12Percentage}%) of this company.`
        });
      }
    }

    // 4. Verify student eligibility - Course (only if company lists eligible courses)
    if (company.courses && company.courses.length > 0) {
      const isCourseEligible = company.courses.some(
        (c) => c.toLowerCase() === student.course.toLowerCase()
      );
      if (!isCourseEligible) {
        return res.status(400).json({
          success: false,
          message: `Eligibility course cutoff: Your course '${student.course}' is not eligible to apply. Eligible courses: ${company.courses.join(', ')}`
        });
      }
    }

    // 5. Check if already applied
    const alreadyApplied = await Application.findOne({ studentId, companyId });
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this company drive.'
      });
    }

    // 6. Create application
    const application = await Application.create({
      studentId,
      companyId
    });

    res.status(201).json({
      success: true,
      message: 'Applied successfully. Your application status is now Pending.',
      application
    });
  } catch (error) {
    console.error('Apply to Company Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error processing application.' });
  }
};

// @desc    Get student's own applications
// @route   GET /api/applications/my-applications
// @access  Private/Student
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('companyId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
};

// @desc    Get all applications for a specific company (Admin View)
// @route   GET /api/applications/company/:companyId
// @access  Private/Admin
export const getCompanyApplications = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Get applications populated with student details
    const applications = await Application.find({ companyId })
      .populate({
        path: 'studentId',
        select: 'name email course department cgpa skills resume profilePhoto'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      company: {
        id: company._id,
        name: company.name,
        packageLpa: company.packageLpa,
        role: company.role,
        rounds: company.rounds || []
      },
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get Company Applications Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, currentRoundIndex } = req.body;

  try {
    let application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (status) {
      if (!['Pending', 'Shortlisted', 'Rejected', 'Selected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status provided.' });
      }
      application.status = status;
    }

    if (currentRoundIndex !== undefined) {
      const idx = parseInt(currentRoundIndex);
      if (!isNaN(idx) && idx >= 0) {
        application.currentRoundIndex = idx;
      }
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      application
    });
  } catch (error) {
    console.error('Update Application Status Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating application status.' });
  }
};
