import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TasksPage } from './components/TasksPage';
import { TaskSubtasksPage } from './components/TaskSubtasksPage';
import { Task } from './types/todo';
import { loadTasks, saveTasks, loadTheme, saveTheme } from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Sync theme
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  // Sync tasks
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add task on main page
  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title,
      completed: false,
      subtasks: [],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle task complete on main page
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete task (instant, reliable, no blocking window.confirm)
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  // Update task from subtasks page
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Find currently active task for the full page
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTask ? (
          // Full Separate Page for Subtasks
          <TaskSubtasksPage
            task={activeTask}
            onBack={() => setActiveTaskId(null)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          // Main Page: Simple Tasks List
          <TasksPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenTask={(task) => setActiveTaskId(task.id)}
          />
        )}
      </main>

      {/* Simple Clean Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-900">
        <p>Moon List</p>
      </footer>

    </div>
  );
}
