import User from '../models/User.js';
import Company from '../models/Company.js';

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private/Student
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

// @desc    Update student profile details
// @route   PUT /api/students/profile
// @access  Private/Student
export const updateStudentProfile = async (req, res) => {
  const { name, course, department, cgpa, skills, educationalDetails } = req.body;

  try {
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (course) updateFields.course = course;
    if (department) updateFields.department = department;
    if (cgpa !== undefined) updateFields.cgpa = parseFloat(cgpa) || 0;

    if (skills) {
      updateFields.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (educationalDetails) {
      if (educationalDetails.class10) {
        if (educationalDetails.class10.schoolName !== undefined) updateFields['educationalDetails.class10.schoolName'] = educationalDetails.class10.schoolName;
        if (educationalDetails.class10.board !== undefined) updateFields['educationalDetails.class10.board'] = educationalDetails.class10.board;
        if (educationalDetails.class10.percentage !== undefined) updateFields['educationalDetails.class10.percentage'] = parseFloat(educationalDetails.class10.percentage) || 0;
        if (educationalDetails.class10.location !== undefined) updateFields['educationalDetails.class10.location'] = educationalDetails.class10.location;
      }

      if (educationalDetails.class12) {
        if (educationalDetails.class12.schoolName !== undefined) updateFields['educationalDetails.class12.schoolName'] = educationalDetails.class12.schoolName;
        if (educationalDetails.class12.board !== undefined) updateFields['educationalDetails.class12.board'] = educationalDetails.class12.board;
        if (educationalDetails.class12.percentage !== undefined) updateFields['educationalDetails.class12.percentage'] = parseFloat(educationalDetails.class12.percentage) || 0;
        if (educationalDetails.class12.location !== undefined) updateFields['educationalDetails.class12.location'] = educationalDetails.class12.location;
      }

      if (educationalDetails.college) {
        if (educationalDetails.college.totalBacklogs !== undefined) {
          updateFields['educationalDetails.college.totalBacklogs'] = parseInt(educationalDetails.college.totalBacklogs) || 0;
        }
        if (educationalDetails.college.ongoingBacklogs !== undefined) {
          updateFields['educationalDetails.college.ongoingBacklogs'] = parseInt(educationalDetails.college.ongoingBacklogs) || 0;
        }
        if (educationalDetails.college.semesters) {
          updateFields['educationalDetails.college.semesters'] = educationalDetails.college.semesters;
        }
      }
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

// @desc    Upload Student Resume PDF
// @route   POST /api/students/upload-resume
// @access  Private/Student
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a resume file to upload.' });
    }

    const student = await User.findById(req.user._id);
    student.resume = `/uploads/${req.file.filename}`;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully.',
      resumeUrl: student.resume,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Upload Resume Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error uploading resume.' });
  }
};

// @desc    Upload Student Profile Photo
// @route   POST /api/students/upload-photo
// @access  Private/Student
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a photo file to upload.' });
    }

    const student = await User.findById(req.user._id);
    student.profilePhoto = `/uploads/${req.file.filename}`;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully.',
      photoUrl: student.profilePhoto
    });
  } catch (error) {
    console.error('Upload Photo Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error uploading photo.' });
  }
};

// @desc    Get companies matching score based on student profile
// @route   GET /api/students/match
// @access  Private/Student
export const getMatchingCompanies = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    const companies = await Company.find({ status: 'Active' });

    const matches = companies.map((company) => {
      // 1. Calculate Skills match (60% weight)
      let skillsScore = 100;
      if (company.skills && company.skills.length > 0) {
        const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
        const matchingSkillsCount = company.skills.filter((skill) =>
          studentSkillsLower.includes(skill.toLowerCase())
        ).length;
        skillsScore = (matchingSkillsCount / company.skills.length) * 100;
      }

      // 2. Calculate CGPA match (20% weight)
      const cgpaScore = student.cgpa >= company.cgpa ? 100 : 0;

      // 3. Calculate Course match (20% weight)
      let courseScore = 100;
      if (company.courses && company.courses.length > 0) {
        const isEligible = company.courses.some(
          (c) => c.toLowerCase() === student.course.toLowerCase()
        );
        courseScore = isEligible ? 100 : 0;
      }

      // 4. Weighted Match Score
      const matchPercentage = Math.round(
        skillsScore * 0.6 + cgpaScore * 0.2 + courseScore * 0.2
      );

      // Identify matching skills for visualization
      const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
      const matchingSkills = company.skills.filter((skill) =>
        studentSkillsLower.includes(skill.toLowerCase())
      );

      return {
        company: {
          _id: company._id,
          name: company.name,
          role: company.role,
          packageLpa: company.packageLpa,
          location: company.location,
          visitDate: company.visitDate,
          cgpa: company.cgpa,
          skills: company.skills,
          courses: company.courses,
          rounds: company.rounds,
          logo: company.logo
        },
        matchPercentage,
        matchingSkills,
        cgpaMeets: student.cgpa >= company.cgpa,
        courseMeets: courseScore === 100
      };
    });

    // Sort by match percentage in descending order
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error('Matching Companies Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error calculating match percentages.' });
  }
};

// @desc    Upload student marksheet (10th, 12th, or Semesters)
// @route   POST /api/students/upload-marksheet
// @access  Private/Student
export const uploadMarksheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a marksheet file to upload.' });
    }

    const { type, semesterNumber } = req.body;
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    let updateQuery = {};

    if (type === 'class10') {
      updateQuery = { $set: { 'educationalDetails.class10.marksheet': fileUrl } };
    } else if (type === 'class12') {
      updateQuery = { $set: { 'educationalDetails.class12.marksheet': fileUrl } };
    } else if (type === 'semester') {
      const semNum = parseInt(semesterNumber);
      if (isNaN(semNum) || semNum < 1 || semNum > 8) {
        return res.status(400).json({ success: false, message: 'Please provide a valid semester number between 1 and 8.' });
      }

      const semesters = student.educationalDetails?.college?.semesters || [];
      const semIndex = semesters.findIndex(s => s.semesterNumber === semNum);

      if (semIndex !== -1) {
        updateQuery = { $set: { [`educationalDetails.college.semesters.${semIndex}.marksheet`]: fileUrl } };
      } else {
        updateQuery = { 
          $push: { 
            'educationalDetails.college.semesters': { semesterNumber: semNum, sgpa: 0, marksheet: fileUrl } 
          } 
        };
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid marksheet type. Must be class10, class12, or semester.' });
    }

    await User.updateOne({ _id: req.user._id }, updateQuery);

    res.status(200).json({
      success: true,
      message: 'Marksheet uploaded successfully.',
      fileUrl,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Upload Marksheet Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error uploading marksheet.' });
  }
};

// @desc    Delete student marksheet (10th, 12th, or Semesters)
// @route   POST /api/students/delete-marksheet
// @access  Private/Student
export const deleteMarksheet = async (req, res) => {
  try {
    const { type, semesterNumber } = req.body;
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    let updateQuery = {};

    if (type === 'class10') {
      updateQuery = { $set: { 'educationalDetails.class10.marksheet': '' } };
    } else if (type === 'class12') {
      updateQuery = { $set: { 'educationalDetails.class12.marksheet': '' } };
    } else if (type === 'semester') {
      const semNum = parseInt(semesterNumber);
      if (isNaN(semNum) || semNum < 1 || semNum > 8) {
        return res.status(400).json({ success: false, message: 'Please provide a valid semester number.' });
      }

      const semesters = student.educationalDetails?.college?.semesters || [];
      const semIndex = semesters.findIndex(s => s.semesterNumber === semNum);

      if (semIndex !== -1) {
        updateQuery = { $set: { [`educationalDetails.college.semesters.${semIndex}.marksheet`]: '' } };
      } else {
        return res.status(400).json({ success: false, message: 'Semester marksheet not found.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid marksheet type.' });
    }

    await User.updateOne({ _id: req.user._id }, updateQuery);

    res.status(200).json({
      success: true,
      message: 'Marksheet deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Marksheet Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting marksheet.' });
  }
};
