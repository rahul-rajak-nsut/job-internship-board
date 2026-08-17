const Job = require('../models/Job');

// @route  POST /api/jobs   (recruiter only)
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, type, salary } = req.body;

    if (!title || !description || !company || !location || !type || !salary) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      type,
      salary,
      postedBy: req.user._id   // comes from the "protect" middleware, NOT from req.body
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/jobs   (public — no auth needed)
const getAllJobs = async (req, res) => {
  try {
    const { location, type, minSalary, maxSalary, page, limit } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      filter.type = type;
    }
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    const currentPage = Number(page) || 1;
    const pageLimit = Number(limit) || 10;
    const skip = (currentPage - 1) * pageLimit;

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name companyName')
      .skip(skip)
      .limit(pageLimit);

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      jobs,
      currentPage,
      totalPages: Math.ceil(totalJobs / pageLimit),
      totalJobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/jobs/my-jobs   (recruiter only)
const getMyJobs = async (req, res) => {
  try {
    
    const jobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/jobs/:id   (recruiter only, must own the job)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // return the UPDATED document, not the old one
      runValidators: true // re-run schema validation (e.g. enum checks) on update
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/jobs/:id   (recruiter only, must own the job)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createJob, getAllJobs, getMyJobs, updateJob, deleteJob };