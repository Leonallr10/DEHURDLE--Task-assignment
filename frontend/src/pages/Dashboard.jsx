import { useState, useEffect } from 'react';
import { getTasks } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getTasks(filter);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <TaskForm onTaskCreated={fetchTasks} />

        {/* Filter */}
        <div style={styles.filterRow}>
          <span style={styles.label}>Filter by status:</span>
          {['', 'todo', 'in-progress', 'done'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === s ? '#4f46e5' : '#e5e7eb',
                color: filter === s ? 'white' : '#374151'
              }}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && <p style={styles.info}>Loading tasks...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p style={styles.info}>No tasks found. Create one above!</p>
        )}

        {/* Task list */}
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '24px' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  label: { fontSize: '14px', fontWeight: '600' },
  filterBtn: { padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  info: { textAlign: 'center', color: '#6b7280' },
  error: { textAlign: 'center', color: 'red' }
};