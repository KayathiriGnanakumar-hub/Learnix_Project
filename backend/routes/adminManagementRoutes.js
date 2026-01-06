import express from 'express';
import { 
  createAdmin, 
  getAllAdmins, 
  deleteAdmin 
} from '../Controllers/adminController.js';

const router = express.Router();

// Create new admin (only permanent admin can do this)
router.post('/create', createAdmin);

// Get all admins (only permanent admin can do this)
router.get('/list', getAllAdmins);

// Delete admin (only permanent admin can do this)
router.delete('/:id', deleteAdmin);

export default router;
