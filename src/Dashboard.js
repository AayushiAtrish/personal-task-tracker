// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tasks')) || [];
      if (Array.isArray(saved)) setTasks(saved);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const chartData = tasks.map((task, index) => ({
    name: `Task ${index + 1}`,
    length: task.description.length || 1,
  }));

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Task Dashboard</h2>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="length" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-header">
              <div className="task-title">
                <strong>{task.title}</strong>
              </div>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>❌</button>
            </div>
            {task.description && <div className="task-desc"><em>{task.description}</em></div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
