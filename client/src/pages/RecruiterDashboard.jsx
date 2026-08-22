import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Link } from 'react-router-dom';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("full-time");
  const [salary, setSalary] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchMyJobs = async () => {
    try {
      const response = await api.get("/jobs/my-jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setPosting(true);

    try {
      await api.post("/jobs", {
        title,
        description,
        company,
        location,
        type,
        salary: Number(salary),
      });

      // Clear the form
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setSalary("");

      // Refresh the job list to show the new one
      fetchMyJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Post a job form */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={posting}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {posting ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List of posted jobs */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Posted Jobs</h2>
          {loadingJobs ? (
            <p className="text-gray-500">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500">You haven't posted any jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job._id} className="rounded-xl shadow-sm border-0">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job.company} · {job.location} · {job.type} · ₹
                        {job.salary.toLocaleString()}
                      </p>
                    </div>
                    <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                      <Button variant="outline" className="rounded-xl">
                        View Applicants
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default RecruiterDashboard;
