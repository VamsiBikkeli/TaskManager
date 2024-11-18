import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Filter, Plus, X, Bell, List } from 'lucide-react';

// Types
type Priority = 'low' | 'medium' | 'high';
type Status = 'pending' | 'completed';
type Tab = 'tasks' | 'reminders'

type Task = {
  id: string;
  title: string
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}

// Helper function to get initial tasks from localStorage
const getInitialTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [];
};

// TaskItem Component
const TaskItem = ({ task, onStatusChange, onDelete }: { task: Task, onStatusChange: (taskId: string) => void, onDelete: (taskId: string) => void }) => {
  const priorityColors = {
    low: 'bg-emerald-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 mb-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-white border-opacity-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onStatusChange(task.id)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {task.status === 'completed' ?
              <CheckCircle2 className="w-6 h-6" /> :
              <Circle className="w-6 h-6" />
            }
          </button>
          <div>
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-400">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{task.dueDate}</span>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

type FilterType = {
  status: string,
  priority: string
}

type ChangeEvent = React.ChangeEvent<HTMLSelectElement>
// FilterPanel Component
const FilterPanel = ({ filters, setFilters }: { filters: FilterType, setFilters: (arg: any) => void }) => {
  return (
    <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-4 mb-6 " style = 'color: red' >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <span className="text-white">Filters:</span>
        </div>
        <select
          value={filters.priority}
          onChange={(e: ChangeEvent) => setFilters({ ...filters, priority: e?.currentTarget.value })}
          className="bg-transparent border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-400"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={filters.status}
          onChange={(e: ChangeEvent) => setFilters({ ...filters, status: e?.currentTarget.value })}
          className="bg-transparent border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-400"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

//Reminder Component

const ReminderTab = ({ tasks }: { tasks: Task[] }) => {
  const getNextTask = () => {
    const now = new Date();
    return tasks
      .filter(task => task.status === 'pending' && new Date(task.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  };

  const nextTask = getNextTask();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white border-opacity-20">
      <h2 className="text-2xl font-bold text-white mb-4">Next Task</h2>
      {nextTask ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-medium text-white">{nextTask.title}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-5 h-5" />
            <span>{formatDate(nextTask.dueDate)}</span>
          </div>
          <div className="text-gray-400">{nextTask.description}</div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${nextTask.priority === 'high' ? 'bg-red-500' :
            nextTask.priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}>
            {nextTask.priority} priority
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No upcoming tasks!</p>
      )}
    </div>
  )
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }: { activeTab: any, setActiveTab: any }) => {
  return (
    <nav className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-2 mb-8">
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'tasks'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
            }`}
        >
          <List className="w-5 h-5" />
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'reminders'
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
            }`}
        >
          <Bell className="w-5 h-5" />
          Reminders
        </button>
      </div>
    </nav>
  );
};

// Main App Component
const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [filters, setFilters] = useState({
    priority: '',
    status: ''
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Priority
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;
    return true;
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending'
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setIsAddingTask(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  // Delete Tasks
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Task Manager 👀
          </h1>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'tasks' ? (
          <>
          <FilterPanel filters={filters} setFilters={setFilters} />
          <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
            </>
      ) : (
      <ReminderTab tasks={tasks} />
   )}

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Task</h2>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e?.currentTarget.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e?.currentTarget.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e?.currentTarget.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e?.currentTarget.value as Priority })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={addTask}
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div >
  );
};

export default TaskManager;