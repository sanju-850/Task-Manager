import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Calendar, MessageSquare, Paperclip } from "lucide-react";
import API from "../api/axios";
import { Modal } from "../components/Modal";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task Form State
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "Medium",
    assignedTo: ""
  });

  const [teamMembers, setTeamMembers] = useState([]);

  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      // Premium dummy data fallback
      setTasks([
        { _id: '1', title: 'Implement Authentication', description: 'Setup JWT and protected routes for the dashboard.', status: 'IN_PROGRESS', priority: 'High', dueDate: 'Today', assignedTo: { name: 'Sanjeev' }, comments: 3, attachments: 1 },
        { _id: '2', title: 'Design System Update', description: 'Refine the dark mode color tokens in Tailwind.', status: 'TODO', priority: 'Medium', dueDate: 'Tomorrow', assignedTo: { name: 'Alice' }, comments: 1, attachments: 0 },
        { _id: '3', title: 'Fix Layout Shift', description: 'Investigate CLS issues on the landing page.', status: 'TODO', priority: 'Low', dueDate: 'Next Week', assignedTo: { name: 'Bob' }, comments: 0, attachments: 2 },
        { _id: '4', title: 'Deploy to Vercel', description: 'Push the latest main branch to production.', status: 'DONE', priority: 'High', dueDate: 'Yesterday', assignedTo: { name: 'Sanjeev' }, comments: 5, attachments: 0 },
      ]);
    }
  };

  const getMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(res.data);
    } catch (error) {
      setTeamMembers([{ _id: "m1", name: "Alice (Demo)" }, { _id: "m2", name: "Bob (Demo)" }]);
    }
  };

  useEffect(() => {
    getTasks();
    getMembers();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    const selectedMember = teamMembers.find(m => m._id === newTask.assignedTo);

    // Create optimistic UI task
    const taskToAdd = {
      _id: Math.random().toString(36).substr(2, 9),
      ...newTask,
      dueDate: 'Just now',
      assignedTo: selectedMember ? { name: selectedMember.name } : { name: 'Unassigned' },
      comments: 0,
      attachments: 0
    };

    // Update UI immediately for that "snappy" feel
    setTasks(prev => [taskToAdd, ...prev]);
    setIsModalOpen(false);
    
    // Reset form
    setNewTask({ title: "", description: "", status: "TODO", priority: "Medium", assignedTo: "" });

    // Background API call
    try {
      const token = localStorage.getItem("token");
      await API.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log("Backend not connected or failed, but UI updated successfully.");
    }
  };

  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(filter.toLowerCase()));

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'border-zinc-300 dark:border-zinc-700/50', dotColor: 'bg-zinc-500', glow: 'group-hover:shadow-[0_0_20px_rgba(161,161,170,0.1)]' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-indigo-200 dark:border-indigo-500/30', dotColor: 'bg-indigo-400', glow: 'group-hover:shadow-[0_0_20px_rgba(129,140,248,0.15)]' },
    { id: 'DONE', title: 'Completed', color: 'border-emerald-200 dark:border-emerald-500/30', dotColor: 'bg-emerald-400', glow: 'group-hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]' }
  ];

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full h-full flex flex-col pb-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 transition-colors">Task Board</h1>
            <p className="text-zinc-500 dark:text-zinc-400 transition-colors">Manage your project progress and issues.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search issues..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
              />
            </div>
            <button className="flex items-center gap-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm dark:shadow-none">
              <Filter size={16} /> Filter
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-[0_0_20px_rgba(79,70,229,0.3)] dark:hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              <Plus size={16} /> New Issue
            </button>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start snap-x">
          {columns.map(col => (
            <motion.div 
              key={col.id}
              variants={itemVariants}
              className="flex-shrink-0 w-80 md:w-96 flex flex-col gap-4 snap-start"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor} shadow-[0_0_8px_currentColor]`} />
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">{col.title}</h3>
                  <span className="bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full ml-1">
                    {filteredTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 min-h-[150px]">
                <AnimatePresence>
                  {filteredTasks.filter(t => t.status === col.id).map((task, idx) => (
                    <TaskCard key={task._id} task={task} glow={col.glow} />
                  ))}
                </AnimatePresence>
                
                {/* Drop area placeholder */}
                <div 
                  onClick={() => {
                    setNewTask(prev => ({ ...prev, status: col.id }));
                    setIsModalOpen(true);
                  }}
                  className="h-24 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/5 flex items-center justify-center hover:border-zinc-300 dark:hover:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <Plus size={20} className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Issue">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Issue Title</label>
            <input 
              type="text" 
              required
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="E.g. Update landing page copy"
              className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Description</label>
            <textarea 
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Add more details about this issue..."
              className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Status</label>
              <select 
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Priority</label>
              <select 
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Assign To</label>
              <select 
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                required
                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Member</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/30"
            >
              Create Issue
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function TaskCard({ task, glow }) {
  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20';
    if (p === 'Medium') return 'text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20';
    return 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-panel p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 group shadow-sm hover:shadow-md dark:shadow-none ${glow}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)} flex items-center gap-1`}>
          {task.priority === 'High' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          {task.priority}
        </span>
        <span className="text-zinc-400 dark:text-zinc-600 text-xs font-mono">TFK-{task._id.slice(0,3)}</span>
      </div>

      <h4 className="text-zinc-900 dark:text-zinc-100 font-semibold text-sm leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{task.title}</h4>
      <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            {task.assignedTo?.name?.charAt(0) || '?'}
          </div>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
          <span className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            <Calendar size={12} /> {task.dueDate}
          </span>
          {task.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={12} /> {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip size={12} /> {task.attachments}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Tasks;
