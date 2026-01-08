import express from 'express';
import {
  submitContact,
  getContactQueries,
  getContactQuery,
  replyToContactQuery,
  updateQueryStatus,
  deleteContactQuery
} from '../Controllers/contactController.js';

const router = express.Router();

// Public route - users can submit contact queries
router.post('/submit', submitContact);

// Admin routes - only admins can access
router.get('/queries', getContactQueries);
router.get('/queries/:id', getContactQuery);
router.post('/queries/:id/reply', replyToContactQuery);
router.put('/queries/:id/status', updateQueryStatus);
router.delete('/queries/:id', deleteContactQuery);

export default router;
