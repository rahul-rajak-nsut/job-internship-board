const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const upload = require('../middleware/upload');

// Applicant applies to a job — protect, must be applicant, Multer handles the file
router.post(
  '/:jobId',
  protect,
  authorizeRoles('applicant'),
  upload.single('resume'),
  applyToJob
);
router.put(
  '/:id/status',
  protect,
  authorizeRoles('recruiter'),
  updateApplicationStatus
);

// Applicant views their own applications
router.get(
  '/my-applications',
  protect,
  authorizeRoles('applicant'),
  getMyApplications
);

// Recruiter views applications for a specific job they posted
router.get(
  '/job/:jobId',
  protect,
  authorizeRoles('recruiter'),
  getApplicationsForJob
);

module.exports = router;