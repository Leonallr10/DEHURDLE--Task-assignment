import { useState } from 'react';
import { createTask } from '../api/tasks';
import { STATUS_OPTIONS } from '../utils/status';

export default function TaskForm({ onTaskCreated }) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', status: 'todo' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    setError('');
    setLoading(true);
    try {
      await createTask(form);
      setForm({ title: '', description: '', dueDate: '', status: 'todo' });
      setExpanded(false);
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-900/50">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-xl font-light text-white shadow-sm">
            +
          </span>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Create new task</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add title, details, and due date</p>
          </div>
        </div>
        <span
          className={`text-slate-400 transition-transform duration-200 dark:text-slate-500 ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Add more context..."
                value={form.description}
                onChange={handleChange}
                className="input-field resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Due date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? 'Creating…' : 'Add task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
