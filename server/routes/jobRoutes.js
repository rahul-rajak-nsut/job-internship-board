const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public route — no auth needed
router.get('/', getAllJobs);

// Protected, recruiter-only routes
router.post('/', protect, authorizeRoles('recruiter'), createJob);
router.get('/my-jobs', protect, authorizeRoles('recruiter'), getMyJobs);
router.put('/:id', protect, authorizeRoles('recruiter'), updateJob);
router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob);

module.exports = router;