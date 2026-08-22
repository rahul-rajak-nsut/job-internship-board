import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import JobApplicants from "./pages/JobApplicants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/my-applications"
          element={
            <ProtectedRoute allowedRole="applicant">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <JobApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/dashboard"
          element={
            <ProtectedRoute allowedRole="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
