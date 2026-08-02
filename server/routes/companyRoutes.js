import express from 'express';
import {
  addCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// Publicly viewable for logged in users
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

// Admin-only management endpoints
router.post('/', authorize('admin'), upload.single('logo'), addCompany);
router.put('/:id', authorize('admin'), upload.single('logo'), updateCompany);
router.delete('/:id', authorize('admin'), deleteCompany);

export default router;
