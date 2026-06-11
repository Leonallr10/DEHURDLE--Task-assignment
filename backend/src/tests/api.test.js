/**
 * Assignment API test suite — run with: npm test (server must be running on PORT)
 */
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 5000}`;
const ts = Date.now();
const userA = { name: 'Test User A', email: `testa_${ts}@example.com`, password: 'secret123' };
const userB = { name: 'Test User B', email: `testb_${ts}@example.com`, password: 'secret456' };

let passed = 0;
let failed = 0;
let tokenA = '';
let tokenB = '';
let taskId = '';

const assert = (name, condition, detail = '') => {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

async function request(method, path, { body, token, expectStatus } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (expectStatus !== undefined && res.status !== expectStatus) {
    throw new Error(`${method} ${path} expected ${expectStatus}, got ${res.status}: ${JSON.stringify(data)}`);
  }

  return { status: res.status, data };
}

async function run() {
  console.log('\n=== DEHURDLE API Test Suite ===\n');

  // Health
  console.log('Task 1 & 2 — Root & Auth protection');
  try {
    const root = await request('GET', '/', { expectStatus: 200 });
    assert('GET / returns 200', root.data?.message === 'Dehurdle API running');

    const noAuth = await request('GET', '/tasks', { expectStatus: 401 });
    assert('GET /tasks without token returns 401', noAuth.data?.message?.includes('token'));

    const badToken = await request('GET', '/tasks', {
      token: 'invalid.token.here',
      expectStatus: 401,
    });
    assert('GET /tasks with invalid token returns 401', badToken.status === 401);
  } catch (e) {
    failed++;
    console.log(`  ✗ Server not reachable — start backend first: ${e.message}`);
    console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
    process.exit(1);
  }

  // Register validation
  console.log('\nAuth — POST /auth/register validation');
  const regMissing = await request('POST', '/auth/register', {
    body: { name: 'X' },
    expectStatus: 400,
  });
  assert('Register missing fields → 400', regMissing.data?.message === 'All fields are required');

  const regShortPw = await request('POST', '/auth/register', {
    body: { name: 'X', email: 'x@test.com', password: '123' },
    expectStatus: 400,
  });
  assert('Register short password → 400', regShortPw.data?.message?.includes('6 characters'));

  const regBadEmail = await request('POST', '/auth/register', {
    body: { name: 'X', email: 'not-an-email', password: 'secret123' },
    expectStatus: 400,
  });
  assert('Register invalid email → 400', regBadEmail.data?.message === 'Invalid email format');

  // Register users
  console.log('\nAuth — Register & Login');
  const regA = await request('POST', '/auth/register', { body: userA, expectStatus: 201 });
  tokenA = regA.data.token;
  assert('Register user A → 201 + token', !!tokenA && regA.data.user?.email === userA.email);

  const regB = await request('POST', '/auth/register', { body: userB, expectStatus: 201 });
  tokenB = regB.data.token;
  assert('Register user B → 201 + token', !!tokenB);

  const dupReg = await request('POST', '/auth/register', { body: userA, expectStatus: 409 });
  assert('Duplicate register → 409', dupReg.data?.message === 'Email already registered');

  const loginOk = await request('POST', '/auth/login', {
    body: { email: userA.email, password: userA.password },
    expectStatus: 200,
  });
  assert('Login valid credentials → 200 + token', !!loginOk.data.token);

  const loginBad = await request('POST', '/auth/login', {
    body: { email: userA.email, password: 'wrongpassword' },
    expectStatus: 401,
  });
  assert('Login wrong password → 401', loginBad.data?.message === 'Invalid email or password');

  const loginMissing = await request('POST', '/auth/login', {
    body: { email: userA.email },
    expectStatus: 400,
  });
  assert('Login missing password → 400', loginMissing.data?.message === 'Email and password are required');

  // Tasks CRUD
  console.log('\nTasks — POST /tasks');
  const noTitle = await request('POST', '/tasks', {
    token: tokenA,
    body: { description: 'no title' },
    expectStatus: 400,
  });
  assert('Create without title → 400', noTitle.data?.message === 'Title is required');

  const badStatus = await request('POST', '/tasks', {
    token: tokenA,
    body: { title: 'Bad status', status: 'invalid' },
    expectStatus: 400,
  });
  assert('Create invalid status → 400', badStatus.data?.message?.includes('Status must be'));

  const badDate = await request('POST', '/tasks', {
    token: tokenA,
    body: { title: 'Bad date', dueDate: 'not-a-date' },
    expectStatus: 400,
  });
  assert('Create invalid dueDate → 400', badDate.data?.message === 'Invalid dueDate format');

  const created = await request('POST', '/tasks', {
    token: tokenA,
    body: {
      title: 'Test Task',
      description: 'Assignment test task',
      status: 'todo',
      dueDate: '2026-12-31',
    },
    expectStatus: 201,
  });
  taskId = created.data._id;
  assert('Create task → 201', created.data.title === 'Test Task' && created.data.status === 'todo');

  console.log('\nTasks — GET /tasks');
  const listA = await request('GET', '/tasks', { token: tokenA, expectStatus: 200 });
  assert('List tasks for user A → 200', Array.isArray(listA.data) && listA.data.length >= 1);

  const listB = await request('GET', '/tasks', { token: tokenB, expectStatus: 200 });
  assert('User B cannot see user A tasks → empty', listB.data.length === 0);

  const filterTodo = await request('GET', '/tasks?status=todo', { token: tokenA, expectStatus: 200 });
  assert('Filter by status=todo works', filterTodo.data.every((t) => t.status === 'todo'));

  const badFilter = await request('GET', '/tasks?status=invalid', { token: tokenA, expectStatus: 400 });
  assert('Invalid status filter → 400', badFilter.data?.message?.includes('Status must be'));

  console.log('\nTasks — PATCH /tasks/:id');
  const updated = await request('PATCH', `/tasks/${taskId}`, {
    token: tokenA,
    body: { status: 'in-progress', title: 'Updated Task' },
    expectStatus: 200,
  });
  assert('Update task → 200', updated.data.status === 'in-progress' && updated.data.title === 'Updated Task');

  const otherUserUpdate = await request('PATCH', `/tasks/${taskId}`, {
    token: tokenB,
    body: { status: 'done' },
    expectStatus: 404,
  });
  assert('User B cannot update user A task → 404', otherUserUpdate.data?.message === 'Task not found');

  const invalidId = await request('PATCH', '/tasks/not-valid-id', {
    token: tokenA,
    body: { status: 'done' },
    expectStatus: 400,
  });
  assert('Invalid task ID on PATCH → 400', invalidId.data?.message === 'Invalid task ID');

  const notFound = await request('PATCH', '/tasks/507f1f77bcf86cd799439011', {
    token: tokenA,
    body: { status: 'done' },
    expectStatus: 404,
  });
  assert('Non-existent task → 404', notFound.data?.message === 'Task not found');

  const emptyUpdate = await request('PATCH', `/tasks/${taskId}`, {
    token: tokenA,
    body: {},
    expectStatus: 400,
  });
  assert('Empty PATCH body → 400', emptyUpdate.data?.message === 'No valid fields to update');

  console.log('\nTasks — DELETE /tasks/:id');
  const otherUserDelete = await request('DELETE', `/tasks/${taskId}`, {
    token: tokenB,
    expectStatus: 404,
  });
  assert('User B cannot delete user A task → 404', otherUserDelete.data?.message === 'Task not found');

  const deleted = await request('DELETE', `/tasks/${taskId}`, {
    token: tokenA,
    expectStatus: 200,
  });
  assert('Delete task → 200', deleted.data?.message === 'Task deleted');

  const deleteAgain = await request('DELETE', `/tasks/${taskId}`, {
    token: tokenA,
    expectStatus: 404,
  });
  assert('Delete already deleted task → 404', deleteAgain.data?.message === 'Task not found');

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
