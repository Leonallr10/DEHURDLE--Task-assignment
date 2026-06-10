import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={{ margin: 0 }}>📋 Task Manager</h2>
      <div style={styles.right}>
        <span>👤 {user?.name}</span>
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: '#4f46e5', color: 'white' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  button: { padding: '6px 14px', backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};