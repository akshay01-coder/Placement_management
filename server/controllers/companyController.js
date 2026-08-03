import Company from '../models/Company.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Application from '../models/Application.js';
import nodemailer from 'nodemailer';
import dns from 'dns';

// Helper: Send professional Drive Eligibility email using Gmail SMTP
const sendEmailViaBrevoAPI = async (toEmail, subject, htmlContent) => {
  const apiKey = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim();
  const senderEmail = (process.env.EMAIL_USER || 'placementmanagement244@gmail.com').trim();
  
  console.log(`[Brevo API] Sending email to ${toEmail} using HTTPS API...`);
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: "Placement Portal",
        email: senderEmail.toLowerCase()
      },
      to: [
        {
          email: toEmail.toLowerCase().trim()
        }
      ],
      subject: subject,
      htmlContent: htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Brevo API error: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('[Brevo API SUCCESS] Message sent! Message ID:', result.messageId);
  return result;
};

const sendCompanyAlertEmail = async (studentEmail, studentName, companyDetails) => {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!emailUser || !emailPass) {
    console.log('[SMTP] Credentials not found in environment. Skipping email alert.');
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'https://placement-management-gamma.vercel.app';
  const subject = `New Placement Opportunity: ${companyDetails.name} - ${companyDetails.role}`;
  
  const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid rgba(99, 102, 241, 0.2);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6); border-radius: 12px; margin-bottom: 10px;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff;">NextHire</span>
          </div>
          <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">New Placement Drive Alert!</h2>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">Your Gateway to Career Success</p>
        </div>

        <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
          <h3 style="margin-top: 0; color: #a5b4fc; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">Opportunity Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Company Name:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${companyDetails.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Job Profile / Role:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${companyDetails.role}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Package:</strong></td>
              <td style="padding: 6px 0; color: #34d399; font-weight: bold;">${companyDetails.packageLpa}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Job Location:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${companyDetails.location}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Visit Date:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${new Date(companyDetails.visitDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Min CGPA Requirement:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9; font-weight: bold;">${companyDetails.cgpa}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Min Class 10 %:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${companyDetails.minClass10Percentage}%</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Min Class 12 %:</strong></td>
              <td style="padding: 6px 0; color: #f1f5f9;">${companyDetails.minClass12Percentage}%</td>
            </tr>
          </table>
          
          <h4 style="margin: 15px 0 5px 0; color: #a5b4fc;">Description:</h4>
          <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">${companyDetails.description}</p>
        </div>

        <div style="text-align: center; margin-top: 10px;">
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">You are eligible for this recruitment drive. Click below to apply directly on the portal:</p>
          <a href="${frontendUrl}/login?redirect=/viewapply" style="display: inline-block; background: linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6); color: #ffffff; text-decoration: none; padding: 12px 35px; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); transition: transform 0.2s;">
            Apply Now
          </a>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px; text-align: center; font-size: 11px; color: #64748b;">
          This is an automated email alert sent because you are registered and meet the eligibility requirements. Please do not reply.
        </div>
      </div>
    `;

  // Check if credentials are Brevo API key -> Bypass SMTP completely and send over HTTPS port 443!
  const cleanPass = emailPass.trim().replace(/^['"]|['"]$/g, '');
  if (cleanPass.startsWith('xsmtpsib-') || cleanPass.startsWith('xkeysib-')) {
    try {
      await sendEmailViaBrevoAPI(studentEmail, subject, htmlContent);
      console.log(`[Brevo API SUCCESS] Company alert sent to eligible student: ${studentEmail}`);
    } catch (err) {
      console.error(`[Brevo API ERROR] Failed to send company alert to ${studentEmail}:`, err.message);
    }
    return;
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false
    },
    family: 4,
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    }
  });

  const mailOptions = {
    from: `"Placement Portal" <${emailUser}>`,
    to: studentEmail,
    subject: subject,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Company alert sent to eligible student: ${studentEmail}`);
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send company alert to ${studentEmail}:`, err.message);
  }
};

// @desc    Add a new company & notify eligible students
// @route   POST /api/companies
// @access  Private/Admin
export const addCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      jobDescription,
      role,
      packageLpa,
      location,
      visitDate,
      cgpa,
      skills,
      courses,
      rounds,
      category,
      lastDateToApply,
      minClass10Percentage,
      minClass12Percentage
    } = req.body;

    if (!name || !description || !jobDescription || !role || !packageLpa || !location || !visitDate || !cgpa || !lastDateToApply) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    // Parse array fields
    let skillsArray = [];
    if (skills) {
      skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
    }

    let coursesArray = [];
    if (courses) {
      coursesArray = Array.isArray(courses) ? courses : JSON.parse(courses);
    }

    let roundsArray = [];
    if (rounds) {
      roundsArray = Array.isArray(rounds) ? rounds : JSON.parse(rounds);
    }

    // Logo path
    let logoPath = '';
    if (req.file) {
      logoPath = `/uploads/${req.file.filename}`;
    }

    // Create company
    const company = await Company.create({
      name,
      description,
      jobDescription,
      role,
      packageLpa,
      location,
      visitDate,
      cgpa: parseFloat(cgpa),
      lastDateToApply,
      minClass10Percentage: parseFloat(minClass10Percentage) || 0,
      minClass12Percentage: parseFloat(minClass12Percentage) || 0,
      skills: skillsArray,
      courses: coursesArray,
      rounds: roundsArray,
      logo: logoPath,
      category: category || 'Tech'
    });

    // Notify all registered students about the new placement drive on dashboard
    const allStudents = await User.find({ role: 'student' });

    const notifications = allStudents.map((student) => ({
      title: `New Placement Drive: ${name}`,
      message: `A new drive for the role of ${role} is live. Package: ${packageLpa}. Visit Date: ${new Date(visitDate).toLocaleDateString()}. Minimum CGPA requirement: ${cgpa}.`,
      studentId: student._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Identify eligible students and email them directly
    const cutoffCgpa = parseFloat(cgpa) || 0;
    const cutoff10th = parseFloat(minClass10Percentage) || 0;
    const cutoff12th = parseFloat(minClass12Percentage) || 0;

    // Fetch all verified students
    const allVerifiedStudents = await User.find({ role: 'student', isVerified: true });

    // Filter in JS for maximum reliability against nested fields & default values
    const eligibleStudents = allVerifiedStudents.filter((student) => {
      // 1. CGPA check
      const studentCgpa = parseFloat(student.cgpa) || 0;
      if (studentCgpa < cutoffCgpa) return false;

      // 2. Class 10th check
      const class10Pct = parseFloat(student.educationalDetails?.class10?.percentage) || 0;
      if (class10Pct < cutoff10th) return false;

      // 3. Class 12th check
      const class12Pct = parseFloat(student.educationalDetails?.class12?.percentage) || 0;
      if (class12Pct < cutoff12th) return false;

      // 4. Course check
      if (coursesArray && coursesArray.length > 0) {
        if (!student.course || !coursesArray.includes(student.course)) {
          return false;
        }
      }

      return true;
    });

    console.log(`[ELIGIBILITY] Found ${eligibleStudents.length} eligible student(s) out of ${allVerifiedStudents.length} verified student(s).`);

    // Asynchronously dispatch email alerts to not block response
    eligibleStudents.forEach((student) => {
      if (student.email) {
        sendCompanyAlertEmail(student.email, student.name, {
          name,
          role,
          packageLpa,
          location,
          visitDate,
          cgpa: cutoffCgpa,
          minClass10Percentage: cutoff10th,
          minClass12Percentage: cutoff12th,
          description
        }).catch((err) =>
          console.error(`[SMTP ERROR] Alert failed for student ${student.email}:`, err.message)
        );
      }
    });

    res.status(201).json({
      success: true,
      message: 'Company added successfully, notifications sent, and eligible students alerted via email.',
      company
    });
  } catch (error) {
    console.error('Add Company Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error adding company.' });
  }
};

// @desc    Get all companies with optional search query filters
// @route   GET /api/companies
// @access  Private (Students & Admins)
export const getAllCompanies = async (req, res) => {
  try {
    const { search, role, location, packageLpa, course, skill } = req.query;
    
    // Build query conditions
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = { $regex: role, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (packageLpa) {
      query.packageLpa = { $regex: packageLpa, $options: 'i' };
    }

    if (course) {
      query.courses = { $in: [course] };
    }

    if (skill) {
      query.skills = { $in: [skill] };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    // Count applications for each company dynamically
    const companiesWithCounts = await Promise.all(
      companies.map(async (company) => {
        const count = await Application.countDocuments({ companyId: company._id });
        return {
          ...company.toObject(),
          appliedStudentsCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      count: companies.length,
      companies: companiesWithCounts
    });
  } catch (error) {
    console.error('Get All Companies Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving companies.' });
  }
};

// @desc    Get a single company details by ID
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Get Company Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving company.' });
  }
};

// @desc    Edit/Update company details
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      jobDescription,
      role,
      packageLpa,
      location,
      visitDate,
      cgpa,
      skills,
      courses,
      rounds,
      status,
      category,
      currentRoundIndex,
      lastDateToApply,
      minClass10Percentage,
      minClass12Percentage
    } = req.body;

    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Parse array fields
    let updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (jobDescription) updatedData.jobDescription = jobDescription;
    if (role) updatedData.role = role;
    if (packageLpa) updatedData.packageLpa = packageLpa;
    if (location) updatedData.location = location;
    if (visitDate) updatedData.visitDate = visitDate;
    if (cgpa) updatedData.cgpa = parseFloat(cgpa);
    if (status) updatedData.status = status;
    if (category) updatedData.category = category;
    if (currentRoundIndex !== undefined) {
      updatedData.currentRoundIndex = parseInt(currentRoundIndex) || 0;
    }
    if (lastDateToApply) updatedData.lastDateToApply = lastDateToApply;
    if (minClass10Percentage !== undefined) {
      updatedData.minClass10Percentage = parseFloat(minClass10Percentage) || 0;
    }
    if (minClass12Percentage !== undefined) {
      updatedData.minClass12Percentage = parseFloat(minClass12Percentage) || 0;
    }

    if (skills) {
      updatedData.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    }
    if (courses) {
      updatedData.courses = Array.isArray(courses) ? courses : JSON.parse(courses);
    }
    if (rounds) {
      updatedData.rounds = Array.isArray(rounds) ? rounds : JSON.parse(rounds);
    }

    // Update logo if new file is uploaded
    if (req.file) {
      updatedData.logo = `/uploads/${req.file.filename}`;
    }

    updatedData.updatedDate = Date.now();

    company = await Company.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Company details updated successfully.',
      company
    });
  } catch (error) {
    console.error('Update Company Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating company.' });
  }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Company Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting company.' });
  }
};
