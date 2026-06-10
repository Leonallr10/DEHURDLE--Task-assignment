import { useState } from 'react';
import { createTask } from '../api/tasks';

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title) return setError('Title is required');
    setError('');
    setLoading(true);
    try {
      await createTask(form);
      setForm({ title: '', description: '', dueDate: '' });
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Create New Task</h3>
      {error && <p style={styles.error}>{error}</p>}
      <input style={styles.input} name="title" placeholder="Title *"
        value={form.title} onChange={handleChange} />
      <input style={styles.input} name="description" placeholder="Description"
        value={form.description} onChange={handleChange} />
      <input style={styles.input} name="dueDate" type="date"
        value={form.dueDate} onChange={handleChange} />
      <button style={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: { padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '13px' }
};