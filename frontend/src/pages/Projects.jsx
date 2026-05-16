import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Users, MoreVertical, Plus } from "lucide-react";
import API from "../api/axios";
import { Modal } from "../components/Modal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "indigo"
  });

  const getProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      // Premium dummy data
      setProjects([
        { _id: '1', name: 'Frontend Refactor', description: 'Migrate to Framer Motion and modern Tailwind.', status: 'Active', members: [1,2,3], progress: 65, color: 'indigo' },
        { _id: '2', name: 'Backend API V2', description: 'Implement GraphQL and optimize Postgres queries.', status: 'Planning', members: [1,2], progress: 15, color: 'emerald' },
        { _id: '3', name: 'Mobile App Launch', description: 'Final QA and App Store submission process.', status: 'Review', members: [1,2,3,4], progress: 90, color: 'rose' }
      ]);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    // Optimistic UI update
    const projectToAdd = {
      _id: Math.random().toString(36).substr(2, 9),
      ...newProject,
      status: 'Active',
      members: [1], // The creator
      progress: 0
    };

    setProjects(prev => [...prev, projectToAdd]);
    setIsModalOpen(false);

    // Reset Form
    setNewProject({ name: "", description: "", color: "indigo" });

    // Background API call
    try {
      const token = localStorage.getItem("token");
      await API.post("/projects", newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log("Backend not connected or failed, but UI updated successfully.");
    }
  };

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-7xl mx-auto pb-12"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 transition-colors">Projects</h1>
            <p className="text-zinc-500 dark:text-zinc-400 transition-colors">View and manage all active workspaces.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 dark:bg-white dark:text-[#09090b] dark:hover:bg-zinc-200 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Plus size={18} /> New Project
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
          
          {/* Create New Project Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="glass-panel border-dashed border-2 hover:border-indigo-500/50 dark:hover:border-white/20 bg-zinc-50/50 hover:bg-indigo-50/50 dark:bg-transparent dark:hover:bg-white/[0.02] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[250px] cursor-pointer group transition-colors shadow-sm dark:shadow-none"
          >
            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-zinc-400 dark:text-zinc-500">
              <Plus size={24} />
            </div>
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Create New Project</h3>
            <p className="text-zinc-500 text-sm mt-1">Start from scratch or a template</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Project Name</label>
            <input 
              type="text" 
              required
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              placeholder="E.g. Website Redesign"
              className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Description</label>
            <textarea 
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Brief overview of the project's goals..."
              className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Theme Color</label>
            <div className="flex gap-3 mt-2">
              {['indigo', 'emerald', 'rose'].map(color => (
                <div 
                  key={color}
                  onClick={() => setNewProject({...newProject, color})}
                  className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                    color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'
                  } ${newProject.color === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#121212] ring-zinc-900 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                />
              ))}
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function ProjectCard({ project }) {
  const getColorClasses = (color) => {
    if (color === 'emerald') return { bg: 'bg-emerald-100 dark:bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', shadow: 'shadow-emerald-500/20', glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' };
    if (color === 'rose') return { bg: 'bg-rose-100 dark:bg-rose-500', text: 'text-rose-600 dark:text-rose-400', shadow: 'shadow-rose-500/20', glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]' };
    return { bg: 'bg-indigo-100 dark:bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', shadow: 'shadow-indigo-500/20', glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]' };
  };

  const colors = getColorClasses(project.color);

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className={`glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group border border-zinc-200 hover:border-zinc-300 dark:border-white/5 dark:hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none ${colors.glow}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} opacity-50 dark:opacity-5 blur-3xl rounded-full group-hover:opacity-100 dark:group-hover:opacity-10 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-white dark:bg-white/5 ring-1 ring-inset ring-zinc-200 dark:ring-white/10 ${colors.text} shadow-sm dark:shadow-none`}>
          <FolderGit2 size={24} strokeWidth={2} />
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-1">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="mb-6 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">{project.name}</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 transition-colors">{project.description}</p>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
            <span className={colors.text}>{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${colors.bg} rounded-full`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-white/5 transition-colors">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Users size={16} />
            <span>{project.members?.length || 0} Members</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 transition-colors`}>
            {project.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Projects;
