import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="email" placeholder="Email"
          value={form.email} onChange={handleChange} />
        <input style={styles.input} name="password" type="password"
          placeholder="Password" value={form.password} onChange={handleChange} />
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  card: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '32px', border: '1px solid #ddd', borderRadius: '8px', width: '320px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: { padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '13px' }
};