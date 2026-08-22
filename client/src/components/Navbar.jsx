import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-indigo-600">JobBoard</h1>
        {user?.role === 'applicant' && (
          <div className="flex gap-4 text-sm">
            <Link to="/applicant/dashboard" className="text-gray-600 hover:text-indigo-600">Browse Jobs</Link>
            <Link to="/applicant/my-applications" className="text-gray-600 hover:text-indigo-600">My Applications</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name} <span className="text-gray-400">({user?.role})</span>
        </span>
        <Button onClick={handleLogout} variant="outline" className="rounded-xl">
          Logout
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;