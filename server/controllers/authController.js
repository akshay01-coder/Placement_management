import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dns from 'dns';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Helper: Generate 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// Helper: Send professional OTP email using Gmail SMTP Nodemailer
const sendOTPEmail = async (email, otp, type = 'verification') => {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  console.log(`\n[SMTP] Attempting to send OTP email to: ${email}`);
  console.log(`[SMTP] Loaded EMAIL_USER: ${emailUser ? 'YES' : 'NO'}`);
  console.log(`[SMTP] Loaded EMAIL_PASS: ${emailPass ? 'YES' : 'NO'}`);

  if (!emailUser || !emailPass || emailUser === 'your_gmail_address@gmail.com' || emailPass === 'your_gmail_app_password') {
    const errorMsg = 'SMTP credentials are not configured or still have default placeholder values in .env file.';
    console.error(`[SMTP ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const subject = type === 'verification' 
    ? 'Email Verification - Placement Management System' 
    : 'Password Reset - Placement Management System';

  const messageHeading = type === 'verification'
    ? 'Verify Your Email Address'
    : 'Reset Your Password';

  const messageText = type === 'verification'
    ? 'Thank you for registering. Use the following 6-digit One-Time Password (OTP) to verify your account:'
    : 'You requested a password reset. Use the following 6-digit One-Time Password (OTP) to reset your password:';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; color: #333; max-width: 500px; margin: auto; border-radius: 12px; border: 1px solid #ddd;">
      <h2 style="color: #6366f1; text-align: center;">${messageHeading}</h2>
      <p>Hello,</p>
      <p>${messageText}</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #e0e7ff; text-align: center; border-radius: 8px; color: #4338ca; margin: 15px 0;">
        ${otp}
      </div>
      <p style="color: #555;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  // Check if credentials are Brevo API key -> Bypass SMTP completely and send over HTTPS port 443!
  const cleanPass = emailPass.trim().replace(/^['"]|['"]$/g, '');
  if (cleanPass.startsWith('xsmtpsib-') || cleanPass.startsWith('xkeysib-')) {
    return await sendEmailViaBrevoAPI(email, subject, htmlContent);
  }

  // 1. Configure Nodemailer dynamically based on SMTP environment variables (supports Brevo on Port 2525)
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

 let transporter;
  try {
    const port = Number(smtpPort) || 2525; // Ensures port is a Number

    transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp-relay.brevo.com',
      port: port,
      secure: port === 465, // Port 2525 & 587 ke liye ALWAYS false
      auth: {
        user: emailUser, // Must be your Brevo login email
        pass: emailPass  // Must be Brevo SMTP key (xkeysib... or xsmtpsib...)
      },
      tls: {
        rejectUnauthorized: false
      },
      family: 4,
      connectionTimeout: 10000 // 10 sec timeout safety
    });
    console.log('[SMTP] Nodemailer transporter created successfully.');
  } catch (err) {
    console.error('[SMTP ERROR] Failed to create transporter:', err);
    throw err;
  }

  // 2. Verify connection configuration
  try {
    console.log('[SMTP] Verifying connection configuration...');
    await transporter.verify();
    console.log('[SMTP] SMTP connection verified successfully! Ready to send emails.');
  } catch (err) {
    console.error('[SMTP ERROR] SMTP verification failed. Check your Gmail address, App Password, or network connection.');
    console.error('[SMTP ERROR DETAILS]:', err);
    throw err;
  }

  const mailOptions = {
    from: `"Placement Portal" <${emailUser}>`,
    to: email.toLowerCase().trim(),
    subject: subject,
    html: htmlContent
  };

  // 4. Send the email
  try {
    console.log(`[SMTP] Calling sendMail() to deliver OTP to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP SUCCESS] Email accepted by SMTP!');
    console.log(`[SMTP SUCCESS] Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[SMTP ERROR] sendMail() failed for recipient ${email}`);
    console.error('[SMTP ERROR DETAILS]:', err);
    throw err;
  }
};

// @desc    Send OTP to email/phone
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  const { identifier } = req.body;

  try {
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide a verification email.' });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();

    // Validate if user already exists and is verified
    const userExists = await User.findOne({ email: trimmedIdentifier });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ success: false, message: 'A user with this email address already exists.' });
    }

    // Generate 6-digit numeric OTP
    const otp = generateOTP();

    // Save or update OTP document
    await OTP.findOneAndUpdate(
      { identifier: trimmedIdentifier },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send the email using the robust helper
    await sendOTPEmail(trimmedIdentifier, otp, 'verification');

    res.status(200).json({
      success: true,
      message: 'Verification OTP has been sent via email.'
    });

  } catch (error) {
    console.error('OTP Send Error:', error.message);
    res.status(500).json({ success: false, message: `Failed to send OTP: ${error.message}` });
  }
};

// Helper: Seed notifications for all pre-existing active companies to a new student
const seedInitialNotificationsForStudent = async (studentId) => {
  try {
    const companies = await Company.find({ status: 'Active' });
    if (companies.length > 0) {
      const initialNotifications = companies.map(company => ({
        title: `New Placement Drive: ${company.name}`,
        message: `A new drive for the role of ${company.role} is live. Package: ${company.packageLpa}. Visit Date: ${new Date(company.visitDate).toLocaleDateString()}. Minimum CGPA requirement: ${company.cgpa}.`,
        studentId: studentId
      }));
      await Notification.insertMany(initialNotifications);
      console.log(`[SIGNUP] Seeded ${initialNotifications.length} notifications for new student ${studentId}.`);
    }
  } catch (notifErr) {
    console.error('[SIGNUP NOTIF ERROR] Failed to seed pre-existing companies notifications:', notifErr.message);
  }
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerStudent = async (req, res) => {
  const { name, email, password, phone, course, department, cgpa, skills, otp } = req.body;

  try {
    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields including the OTP.' });
    }

    // 1. Verify OTP code
    const otpRecord = await OTP.findOne({ identifier: email.trim().toLowerCase() });
    if (!otpRecord || otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Parse skills
    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Check if user exists
    const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (emailExists) {
      if (emailExists.isVerified) {
        return res.status(400).json({ success: false, message: 'A user with this email address already exists.' });
      }

      // If unverified, update their details and set verified directly to true!
      emailExists.name = name;
      emailExists.password = password;
      if (phone) emailExists.phone = phone.trim();
      emailExists.course = course || '';
      emailExists.department = department || '';
      emailExists.cgpa = cgpa ? parseFloat(cgpa) : 0;
      emailExists.skills = skillsArray;
      emailExists.isVerified = true;
      
      await emailExists.save();
      await OTP.deleteOne({ _id: otpRecord._id });
      await seedInitialNotificationsForStudent(emailExists._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful and account verified!'
      });
    }


    // Create the verified student user directly
    const student = await User.create({
      name,
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      password,
      role: 'student',
      course: course || '',
      department: department || '',
      cgpa: cgpa ? parseFloat(cgpa) : 0,
      skills: skillsArray,
      isVerified: true
    });

    await OTP.deleteOne({ _id: otpRecord._id });
    await seedInitialNotificationsForStudent(student._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful and account verified!'
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/register
// @access  Public
export const registerAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, and Password).' });
    }

    const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (emailExists) {
      if (emailExists.isVerified) {
        return res.status(400).json({ success: false, message: 'An admin with this email address already exists.' });
      }

      // Allow updating and re-triggering verification for unverified admins
      emailExists.name = name;
      emailExists.password = password;
      if (phone) emailExists.phone = phone.trim();
      
      await emailExists.save();

      const otpCode = generateOTP();
      await OTP.findOneAndUpdate(
        { identifier: email.trim().toLowerCase() },
        { otp: otpCode, createdAt: new Date() },
        { upsert: true, new: true }
      );

      try {
        await sendOTPEmail(email.trim().toLowerCase(), otpCode, 'verification');
        return res.status(201).json({
          success: true,
          message: 'Admin registration updated! Verification OTP sent to your email.'
        });
      } catch (emailError) {
        console.error('[SMTP ADMIN REGISTRATION UPDATE FAILURE] OTP send error:', emailError.message);
        return res.status(500).json({
          success: false,
          message: `Failed to send verification email: ${emailError.message}`
        });
      }
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone: phone.trim() });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'A user with this mobile number already exists.' });
      }
    }

    // Create the admin user
    const admin = await User.create({
      name,
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      password,
      role: 'admin',
      isVerified: false
    });

    if (admin) {
      const otpCode = generateOTP();
      await OTP.findOneAndUpdate(
        { identifier: email.trim().toLowerCase() },
        { otp: otpCode, createdAt: new Date() },
        { upsert: true, new: true }
      );

      try {
        await sendOTPEmail(email.trim().toLowerCase(), otpCode, 'verification');
        res.status(201).json({
          success: true,
          message: 'Admin registration successful! Verification OTP sent to your email.'
        });
      } catch (emailError) {
        // Rollback
        await User.findByIdAndDelete(admin._id);
        await OTP.deleteMany({ identifier: email.trim().toLowerCase() });
        console.error('[SMTP ADMIN REGISTRATION FAILURE] Rollback executed:', emailError.message);
        return res.status(500).json({
          success: false,
          message: `Failed to send verification email: ${emailError.message}`
        });
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid admin data provided.' });
    }
  } catch (error) {
    console.error('Admin Registration Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error during admin registration.' });
  }
};

// @desc    Authenticate student or admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  // Accept loginId as email or custom field
  const loginId = (email || req.body.loginId || req.body.phone || '').toString().trim();

  try {
    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both credentials and password.' });
    }

    let user;
    if (loginId === 'Placementadmin#111' && password === 'Placementadmin#111') {
      // Auto-authenticate as the default seeded admin
      user = await User.findOne({ email: 'admin111@gmail.com' });
      if (!user) {
        user = await User.create({
          name: 'Placement Officer',
          email: 'admin111@gmail.com',
          password: 'password123',
          role: 'admin',
          isVerified: true
        });
      }
    } else {
      // Find user by either email or phone and explicitly select password field
      user = await User.findOne({
        $or: [
          { email: loginId.toLowerCase() },
          { phone: loginId }
        ]
      }).select('+password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or password.' });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or password.' });
      }
    }

    // During login, if the user's email is not verified, restrict access
    if (user.email && !user.isVerified) {
      return res.status(403).json({
        success: false,
        isVerified: false,
        email: user.email,
        message: 'Please verify your email address first.'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        course: user.course,
        department: user.department,
        cgpa: user.cgpa,
        skills: user.skills,
        resume: user.resume,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving user profile.' });
  }
};

// @desc    Verify email verification OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide both email and OTP.' });
    }

    const otpRecord = await OTP.findOne({ identifier: email.trim().toLowerCase(), otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Delete OTP code
    await OTP.deleteMany({ identifier: email.trim().toLowerCase() });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
};

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email address is already verified.' });
    }

    const otpCode = generateOTP();
    await OTP.findOneAndUpdate(
      { identifier: email.trim().toLowerCase() },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    try {
      await sendOTPEmail(email.trim().toLowerCase(), otpCode, 'verification');
      res.status(200).json({
        success: true,
        message: 'A new OTP has been sent to your email.'
      });
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: `Failed to send verification email: ${emailError.message}`
      });
    }
  } catch (error) {
    console.error('Resend OTP Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while resending OTP.' });
  }
};

// @desc    Initiate forgot password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address.' });
    }

    const otpCode = generateOTP();
    await OTP.findOneAndUpdate(
      { identifier: email.trim().toLowerCase() },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    try {
      await sendOTPEmail(email.trim().toLowerCase(), otpCode, 'recovery');
      res.status(200).json({
        success: true,
        message: 'A password reset OTP has been sent to your email.'
      });
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: `Failed to send password reset email: ${emailError.message}`
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while processing forgot password.' });
  }
};

// @desc    Verify recovery OTP
// @route   POST /api/auth/verify-forgot-otp
// @access  Public
export const verifyForgotPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide both email and OTP.' });
    }

    const otpRecord = await OTP.findOne({ identifier: email.trim().toLowerCase(), otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    });
  } catch (error) {
    console.error('Verify Recovery OTP Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const otpRecord = await OTP.findOne({ identifier: email.trim().toLowerCase(), otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update password
    user.password = password;
    await user.save();

    // Clean up OTP code
    await OTP.deleteMany({ identifier: email.trim().toLowerCase() });

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while resetting password.' });
  }
};

// @desc    Test email configuration independently
// @route   GET /api/auth/test-email
// @access  Public
export const testEmail = async (req, res) => {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  console.log(`\n[TEST SMTP] Initiating test email configuration verification...`);
  console.log(`[TEST SMTP] Recipient/Sender email target: ${emailUser}`);

  try {
    if (!emailUser || emailUser === 'your_gmail_address@gmail.com') {
      const errText = 'EMAIL_USER is not configured with a valid email address in your .env file.';
      console.error(`[TEST SMTP ERROR] ${errText}`);
      return res.status(400).json({
        success: false,
        message: errText
      });
    }

    const testCode = '987654';
    const info = await sendOTPEmail(emailUser, testCode, 'verification');

    res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${emailUser}!`,
      info: {
        messageId: info.messageId,
        response: info.response
      }
    });
  } catch (error) {
    console.error('[TEST SMTP ERROR] Test route execution failed:', error.message);
    res.status(500).json({
      success: false,
      message: `Test email failed: ${error.message}`
    });
  }
};

// @desc    Delete logged in user account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all applications filed by this student
    await Application.deleteMany({ studentId: userId });

    // Delete user from DB
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated applications have been permanently deleted.'
    });
  } catch (error) {
    console.error('Delete Account Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting account.' });
  }
};

// @desc    Get list of all registered students
// @route   GET /api/auth/admin/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('+password');
    res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Get All Students Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while retrieving students list.' });
  }
};

// @desc    Delete a student account by Admin
// @route   DELETE /api/auth/admin/students/:id
// @access  Private/Admin
export const deleteStudentByAdmin = async (req, res) => {
  try {
    const studentId = req.params.id;
    await Application.deleteMany({ studentId });
    await User.findByIdAndDelete(studentId);
    res.status(200).json({
      success: true,
      message: 'Student account has been permanently deleted by administrator.'
    });
  } catch (error) {
    console.error('Admin Delete Student Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting student.' });
  }
};
