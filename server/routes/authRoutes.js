const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/test-protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are logged in as ${req.user.role}` });
});
router.get('/test-recruiter-only', protect, authorizeRoles('recruiter'), (req, res) => {
  res.json({ message: 'Welcome recruiter, you can post jobs' });
});

module.exports = router;