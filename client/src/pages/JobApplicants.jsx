import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      fetchApplicants();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">
            Back
          </button>
          <h1 className="text-2xl font-bold">Applicants</h1>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">No one has applied to this job yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Card key={app._id} className="rounded-xl shadow-sm border-0">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{app.applicant?.name}</h3>
                    <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                    <a
                      href={`http://localhost:5000/${app.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      View Resume ({app.resumeOriginalName})
                    </a>
                  </div>

                  <select
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="h-9 rounded-xl border border-gray-200 px-3 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicants;