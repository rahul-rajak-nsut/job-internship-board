import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/lib/api';

function ApplicantDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minSalary, setMinSalary] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [openJobId, setOpenJobId] = useState(null); // tracks which job's dialog is open

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (type) params.type = type;
      if (minSalary) params.minSalary = minSalary;

      const response = await api.get('/jobs', { params });
      setJobs(response.data.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location, type, minSalary]);

  const handleApply = async (jobId) => {
    if (!resumeFile) {
      setApplyError('Please select a resume file');
      return;
    }

    setApplying(true);
    setApplyError('');
    setApplySuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      await api.post(`/applications/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setApplySuccess('Application submitted!');
      setResumeFile(null);
      setTimeout(() => {
        setOpenJobId(null);
        setApplySuccess('');
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <h1 className="text-2xl font-bold">Browse Jobs</h1>

        <div className="grid grid-cols-3 gap-4">
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm">
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
          <Input placeholder="Min Salary" type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className="rounded-xl" />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs match your filters.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job._id} className="rounded-xl shadow-sm border-0">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.company} · {job.location} · {job.type} · ₹{job.salary.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>

                  <Dialog open={openJobId === job._id} onOpenChange={(open) => setOpenJobId(open ? job._id : null)}>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0 ml-4">
                        Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Apply to {job.title}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                          className="w-full text-sm"
                        />

                        {applyError && <p className="text-sm text-red-500">{applyError}</p>}
                        {applySuccess && <p className="text-sm text-green-600">{applySuccess}</p>}

                        <Button
                          onClick={() => handleApply(job._id)}
                          disabled={applying}
                          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantDashboard;