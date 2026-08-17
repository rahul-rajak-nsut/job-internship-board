const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  resumeOriginalName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  }
}, { timestamps: true });

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);