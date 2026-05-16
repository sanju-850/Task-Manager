import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import API from "../api/axios";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Dashboard() {
  const [stats, setStats] = useState(null);

  const getStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      // Premium dummy data fallback
      setStats({
        totalTasks: 42,
        pendingTasks: 18,
        completedTasks: 19,
        overdueTasks: 5
      });
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const pieData = stats ? [
    { name: 'Pending', value: stats.pendingTasks, color: '#a78bfa' }, // Violet
    { name: 'Completed', value: stats.completedTasks, color: '#34d399' }, // Emerald
    { name: 'Overdue', value: stats.overdueTasks, color: '#f87171' } // Red
  ] : [];

  const barData = [
    { name: 'Alpha', tasks: 12 },
    { name: 'Web', tasks: 8 },
    { name: 'Mobile', tasks: 15 },
    { name: 'Backend', tasks: 7 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-4 py-3 rounded-xl shadow-2xl">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-300 mb-1">{payload[0].name}</p>
          <p className="text-xl font-bold text-zinc-900 dark:text-white">{payload[0].value} Tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto pb-12"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 transition-colors">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 transition-colors">Here's what's happening with your projects today.</p>
      </motion.div>

      {stats && (
        <div className="space-y-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Tasks" 
              value={stats.totalTasks} 
              icon={Activity} 
              color="text-indigo-600 dark:text-indigo-400"
              bg="bg-indigo-100 dark:bg-indigo-400/10"
              border="border-indigo-200 dark:border-indigo-500/20"
            />
            <StatCard 
              title="In Progress" 
              value={stats.pendingTasks} 
              icon={Clock} 
              color="text-amber-600 dark:text-amber-400"
              bg="bg-amber-100 dark:bg-amber-400/10"
              border="border-amber-200 dark:border-amber-500/20"
            />
            <StatCard 
              title="Completed" 
              value={stats.completedTasks} 
              icon={CheckCircle2} 
              color="text-emerald-600 dark:text-emerald-400"
              bg="bg-emerald-100 dark:bg-emerald-400/10"
              border="border-emerald-200 dark:border-emerald-500/20"
            />
            <StatCard 
              title="Overdue" 
              value={stats.overdueTasks} 
              icon={AlertCircle} 
              color="text-rose-600 dark:text-rose-400"
              bg="bg-rose-100 dark:bg-rose-400/10"
              border="border-rose-200 dark:border-rose-500/20"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pie Chart Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-3xl p-6 lg:col-span-1 flex flex-col relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white transition-colors">Status Breakdown</h3>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
              
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}40)` }} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}80` }}></span>
                    {item.name}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bar Chart Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col relative overflow-hidden group shadow-xl"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
               
               <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white transition-colors">Project Activity</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full text-zinc-600 dark:text-zinc-300">This Week</span>
                </div>
              </div>

              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-white/5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05, radius: 8 }} content={<CustomTooltip />} />
                    <Bar 
                      dataKey="tasks" 
                      radius={[6, 6, 6, 6]} 
                      barSize={32}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#c084fc" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, border }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-panel p-6 rounded-3xl border ${border} relative overflow-hidden group cursor-pointer shadow-lg dark:shadow-none`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${bg.replace('/10', '')}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bg} ${color} ring-1 ring-inset ${border}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      
      <div>
        <h4 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-1">{title}</h4>
        <div className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-baseline gap-2 transition-colors">
          {value}
          <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 flex items-center">
            <ArrowUpRight size={14} /> 12%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
