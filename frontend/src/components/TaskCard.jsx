import { useState } from 'react';
import { updateTask, deleteTask } from '../api/tasks';

const statusColors = {
  'todo': '#f59e0b',
  'in-progress': '#3b82f6',
  'done': '#10b981'
};

export default function TaskCard({ task, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    setLoading(true);
    try {
      await updateTask(task._id, { status: e.target.value });
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await deleteTask(task._id);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <h4 style={styles.title}>{task.title}</h4>
        <span style={{ ...styles.badge, backgroundColor: statusColors[task.status] }}>
          {task.status}
        </span>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      {task.dueDate && (
        <p style={styles.due}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      )}
      <div style={styles.actions}>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={loading}
          style={styles.select}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button style={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white', marginBottom: '12px' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  title: { margin: 0, fontSize: '16px' },
  badge: { padding: '4px 10px', borderRadius: '999px', color: 'white', fontSize: '12px' },
  desc: { fontSize: '14px', color: '#6b7280', margin: '4px 0' },
  due: { fontSize: '12px', color: '#9ca3af' },
  actions: { display: 'flex', gap: '10px', marginTop: '12px' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};