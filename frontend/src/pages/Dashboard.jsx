import { useState, useEffect, useMemo } from 'react';
import { getTasks } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';
import { FILTER_OPTIONS, statusDot } from '../utils/status';

function StatCard({ label, count, dotClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        {dotClass && <span className={`h-2 w-2 rounded-full ${dotClass}`} />}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{count}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

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
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/20">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Your tasks
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Organize, track, and complete your work.</p>
        </div>

        {!loading && !filter && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total" count={stats.total} />
            <StatCard label="To Do" count={stats.todo} dotClass={statusDot.todo} />
            <StatCard label="In Progress" count={stats.inProgress} dotClass={statusDot['in-progress']} />
            <StatCard label="Done" count={stats.done} dotClass={statusDot.done} />
          </div>
        )}

        <div className="mb-8">
          <TaskForm onTaskCreated={fetchTasks} />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-slate-600 dark:text-slate-400">Filter:</span>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                filter === opt.value
                  ? 'bg-brand-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            {error}
            <button
              type="button"
              onClick={fetchTasks}
              className="ml-2 font-semibold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && !error && tasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl dark:bg-slate-800">
              📋
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">No tasks yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {filter ? 'No tasks match this filter.' : 'Create your first task above to get started.'}
            </p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
