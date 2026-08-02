import express from 'express';
import {
  applyToCompany,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// Student actions
router.post('/apply/:companyId', authorize('student'), applyToCompany);
router.get('/my-applications', authorize('student'), getMyApplications);

// Admin actions
router.get('/company/:companyId', authorize('admin'), getCompanyApplications);
router.put('/:id/status', authorize('admin'), updateApplicationStatus);

export default router;
