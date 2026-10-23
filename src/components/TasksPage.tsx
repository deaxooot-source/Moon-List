import React, { useState, useRef } from 'react';
import { Plus, Trash2, Check, ChevronLeft, ListChecks } from 'lucide-react';
import { Task } from '../types/todo';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTask: (task: Task) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onOpenTask,
}) => {
  const [taskInput, setTaskInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = taskInput.trim();
    if (!clean) return;

    onAddTask(clean);
    setTaskInput('');
    inputRef.current?.focus();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Quick Add Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="ما هي المهمة التي تريد إنجازها؟ (اكتب واضغط Enter)"
          className="flex-1 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!taskInput.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مهمة</span>
        </button>
      </form>

      {/* Header Info */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>قائمة المهام ({tasks.length})</span>
          <span>المكتملة: {completedCount} من {tasks.length}</span>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2.5">
        {tasks.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">
              لا توجد أي مهام حالياً
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              أضف مهمتك الأولى في الحقل أعلاه، ثم انقر عليها لإضافة مهام فرعية في صفحتها المستقلة.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const subCount = task.subtasks ? task.subtasks.length : 0;
            const subDone = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

            return (
              <div
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-xs"
              >
                {/* Left side: Checkbox + Title + Subtask count */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 text-transparent'
                    }`}
                    title={task.completed ? 'إلغاء الإكمال' : 'إكمال المهمة'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm sm:text-base font-semibold block truncate select-none ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Subtasks summary text */}
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      <ListChecks className="w-3.5 h-3.5 text-blue-500" />
                      {subCount > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {subDone}/{subCount} مهام فرعية
                        </span>
                      ) : (
                        <span>لا توجد مهام فرعية (انقر للإضافة)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Open full page arrow + Instant working delete button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-1.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
