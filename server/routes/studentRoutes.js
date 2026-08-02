import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  uploadPhoto,
  getMatchingCompanies,
  uploadMarksheet,
  deleteMarksheet
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Apply protect middleware to all student routes
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.post('/upload-marksheet', upload.single('marksheet'), uploadMarksheet);
router.post('/delete-marksheet', deleteMarksheet);
router.get('/match', getMatchingCompanies);

export default router;
