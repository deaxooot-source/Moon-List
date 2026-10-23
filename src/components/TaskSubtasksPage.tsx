import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import { Task, Subtask } from '../types/todo';

interface TaskSubtasksPageProps {
  task: Task;
  onBack: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskSubtasksPage: React.FC<TaskSubtasksPageProps> = ({
  task,
  onBack,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleText(task.title);
  }, [task.title]);

  // Focus the input when entering the page
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = subtaskInput.trim();
    if (!clean) return;

    const newSub: Subtask = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: clean,
      completed: false,
    };

    const updatedTask: Task = {
      ...task,
      subtasks: [...task.subtasks, newSub],
    };

    onUpdateTask(updatedTask);
    setSubtaskInput('');
    inputRef.current?.focus();
  };

  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );

    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
    };

    onUpdateTask(updatedTask);
  };

  const handleDeleteSubtask = (subId: string) => {
    const updatedSubtasks = task.subtasks.filter((s) => s.id !== subId);
    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
    };
    onUpdateTask(updatedTask);
  };

  const handleToggleMainComplete = () => {
    onUpdateTask({
      ...task,
      completed: !task.completed,
    });
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (titleText.trim()) {
      onUpdateTask({
        ...task,
        title: titleText.trim(),
      });
    } else {
      setTitleText(task.title);
    }
  };

  const handleDeleteThisTask = () => {
    onDeleteTask(task.id);
    onBack();
  };

  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const totalCount = task.subtasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Navigation Bar: Back & Delete */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى قائمة المهام</span>
        </button>

        <button
          onClick={handleDeleteThisTask}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          title="حذف المهمة الأساسية بالكامل"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف المهمة</span>
        </button>
      </div>

      {/* Main Task Title & Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
        <button
          type="button"
          onClick={handleToggleMainComplete}
          className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 text-transparent'
          }`}
          title={task.completed ? 'إلغاء الإكمال' : 'تحديد المهمة الأساسية كمكتملة'}
        >
          <Check className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            المهمة الأساسية:
          </span>
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setTitleText(task.title);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full text-lg sm:text-xl font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-blue-500 rounded-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className={`text-lg sm:text-xl font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
              title="انقر لتعديل العنوان"
            >
              {task.title}
            </h1>
          )}
        </div>
      </div>

      {/* Subtasks Section */}
      <div className="space-y-4 pt-2">
        
        {/* Subtask Header & Progress */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            المهام الفرعية
          </h2>
          {totalCount > 0 && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              تم إنجاز {completedCount} من {totalCount} ({percent}%)
            </span>
          )}
        </div>

        {/* Progress Line */}
        {totalCount > 0 && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}

        {/* Add Subtask Input */}
        <form onSubmit={handleAddSubtask} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="اكتب مهمة فرعية جديدة واضغط Enter..."
            className="flex-1 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!subtaskInput.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة</span>
          </button>
        </form>

        {/* Subtasks List */}
        <div className="space-y-2 pt-1">
          {task.subtasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                لا توجد مهام فرعية لهذه المهمة حتى الآن.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                اكتب أي خطوة فرعية في الحقل أعلاه لإضافتها فوراً.
              </p>
            </div>
          ) : (
            task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                      subtask.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <span
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className={`text-sm cursor-pointer select-none truncate flex-1 ${
                      subtask.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>

                {/* Instant Delete Button - completely functional with no window.confirm blocker */}
                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="حذف المهمة الفرعية"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
