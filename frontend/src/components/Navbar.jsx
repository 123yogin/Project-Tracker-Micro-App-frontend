import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar card">
      <Link to="/dashboard" className="navbar-logo">
        Project Tracker
      </Link>
      <button type="button" className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
