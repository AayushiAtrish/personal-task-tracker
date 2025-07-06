import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required');
      return;
    }
    localStorage.setItem('username', username);
    onLogin(username);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/favicon.png" alt="App Logo" className="logo" />
        <h2>Login to TaskBoard</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ username, setLoggedIn }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [prioritySort, setPrioritySort] = useState('none');

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    const fixed = saved.map(task => ({ ...task, category: task.category || '' }));
    setTasks(fixed);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || !priority || !category) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      dueDate,
      priority,
      category,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDueDate('');
    setPriority('');
    setCategory('');
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    if (due.getTime() === today.getTime()) return 'Due Today';
    if (due < today) return 'Overdue';
    return 'Upcoming';
  };

  const filteredTasks = tasks.filter((task) => {
    const status = getDueStatus(task.dueDate);
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'dueToday') return status === 'Due Today';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (prioritySort !== 'none') {
      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      const diff = priorityMap[b.priority] - priorityMap[a.priority];
      return prioritySort === 'high-to-low' ? diff : -diff;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleLogout = () => {
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  return (
    <div className="app-container">
      <div className="top-right-controls">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
          {darkMode ? '🌞' : '🌙'}
        </button>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          🔓
        </button>
      </div>

      <h2>✅ Welcome, {username}</h2>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="">Select Priority</option>
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🌱 Low</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Work">💼 Work</option>
          <option value="Personal">🏠 Personal</option>
          <option value="Study">📚 Study</option>
          <option value="Others">📌 Others</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      <div className="priority-sort">
        <label htmlFor="sortPriority">🔽 Sort by Priority:</label>
        <select id="sortPriority" value={prioritySort} onChange={(e) => setPrioritySort(e.target.value)}>
          <option value="none">None</option>
          <option value="high-to-low">High → Low</option>
          <option value="low-to-high">Low → High</option>
        </select>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>📋 All</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>⏳ Pending</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>✅ Completed</button>
        <button className={filter === 'dueToday' ? 'active' : ''} onClick={() => setFilter('dueToday')}>📅 Due Today</button>
      </div>

      <ul className="task-list">
        {sortedTasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${getDueStatus(task.dueDate) === 'Overdue' ? 'overdue' : ''}`}>
            <div className="task-content-header">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <strong>{task.title}</strong>
              </label>
              <button className="delete-btn" onClick={() => handleDelete(task.id)}>❌</button>
            </div>
            <div className="task-content">
              <div className="task-meta">
                {task.completed ? '✅ Done' : '⏳ Pending'} — {new Date(task.createdAt).toLocaleString()}
              </div>
              <div className="task-date">
                📅 {task.dueDate} — <strong>{getDueStatus(task.dueDate)}</strong>
              </div>
              {task.priority && (
                <div className="task-priority">
                  🚨 Priority: <strong>{task.priority}</strong>
                </div>
              )}
              {task.category && (
                <div className="task-category">
                  🗂️ Category: <strong>{task.category}</strong>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// App Component
const App = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('username'));

  return (
    <Routes>
      <Route
        path="/"
        element={
          loggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={(name) => {
              setUsername(name);
              setLoggedIn(true);
            }} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          loggedIn ? (
            <Dashboard username={username} setLoggedIn={setLoggedIn} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
