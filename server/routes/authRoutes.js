import express from 'express';
import { 
  registerStudent, 
  loginUser, 
  getMe, 
  sendOTP, 
  registerAdmin,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  testEmail,
  deleteAccount,
  getAllStudents,
  deleteStudentByAdmin
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/send-otp', sendOTP);
router.post('/register', registerStudent);
router.post('/admin/register', registerAdmin);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-otp', verifyForgotPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/test-email', testEmail);

// Protected routes
router.get('/me', protect, getMe);
router.delete('/delete-account', protect, deleteAccount);
router.get('/admin/students', protect, authorize('admin'), getAllStudents);
router.delete('/admin/students/:id', protect, authorize('admin'), deleteStudentByAdmin);

export default router;
