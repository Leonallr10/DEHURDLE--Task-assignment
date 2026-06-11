export const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', color: 'amber' },
  { value: 'in-progress', label: 'In Progress', color: 'blue' },
  { value: 'done', label: 'Done', color: 'emerald' },
];

export const FILTER_OPTIONS = [
  { value: '', label: 'All' },
  ...STATUS_OPTIONS,
];

export const statusStyles = {
  todo: 'bg-amber-100 text-amber-800 ring-amber-200',
  'in-progress': 'bg-blue-100 text-blue-800 ring-blue-200',
  done: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
};

export const statusDot = {
  todo: 'bg-amber-500',
  'in-progress': 'bg-blue-500',
  done: 'bg-emerald-500',
};

export const getStatusLabel = (value) =>
  STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
