import { useState } from 'react';
import { updateTask, deleteTask } from '../api/tasks';
import { STATUS_OPTIONS, statusStyles, statusDot, getStatusLabel } from '../utils/status';

export default function TaskCard({ task, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status || loading) return;
    setLoading(true);
    try {
      await updateTask(task._id, { status: newStatus });
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(task._id);
      onUpdate();
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const isOverdue =
    task.dueDate &&
    task.status !== 'done' &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <article
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:hover:shadow-slate-900/50 ${
        loading ? 'pointer-events-none opacity-60' : ''
      } ${task.status === 'done' ? 'border-emerald-100 dark:border-emerald-900/50' : 'border-slate-200 dark:border-slate-800'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[task.status]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[task.status]}`} />
              {getStatusLabel(task.status)}
            </span>
            {isOverdue && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
                Overdue
              </span>
            )}
          </div>
          <h3 className={`text-base font-semibold text-slate-900 dark:text-white ${task.status === 'done' ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{task.description}</p>
          )}
          {task.dueDate && (
            <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <span>📅</span>
              Due {new Date(task.dueDate).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/50 dark:hover:text-red-400"
          aria-label="Delete task"
        >
          🗑
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => handleStatusChange(s.value)}
            disabled={loading}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
              task.status === s.value
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {confirmDelete && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/95 p-4 backdrop-blur-sm dark:bg-slate-900/95">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Delete this task?</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
