const Application = require("../models/Application");
const Job = require("../models/Job");

// @route  POST /api/applications/:jobId   (applicant only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    //step 1- check job exists
    const job = await Job.findById(jobId);
    if (!job) {
     return res.status(404).json({ message: "Job not found" });
    }

    //step-2 check resume was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is Required" });
    }

    //step-3 checkk for duplicate application
    const existingApplication = await Application.findOne({
      applicant: req.user._id,
      job: jobId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "you have already applied to this job" });
    }

    //step-4 create application
    const application = await Application.create({
      applicant: req.user._id,
      job: jobId,
      resumeUrl: req.file.path,
      resumeOriginalName: req.file.originalname,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/applications/my-applications   (applicant only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/applications/job/:jobId   (recruiter only, must own the job)
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ownership check — same pattern as Phase 4
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob };