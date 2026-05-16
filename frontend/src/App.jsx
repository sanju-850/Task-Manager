import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CheckSquare, FolderGit2, LogOut, Settings, Bell, Search, User, CheckCircle2 } from "lucide-react";

import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import SettingsPage from "./pages/Settings";

function Sidebar() {
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navLinks = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <motion.div 
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-[260px] h-screen fixed left-0 top-0 p-5 z-40 hidden md:block"
    >
      <div className="w-full h-full glass-panel rounded-3xl premium-border flex flex-col overflow-hidden relative shadow-xl">
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none transition-colors duration-500" />
        
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30">
              <span className="text-white font-bold text-xl tracking-tighter">TF</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white transition-colors">TaskFlow</span>
          </div>

          <div className="space-y-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative group ${
                    isActive ? 'text-indigo-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-indigo-500/10 dark:bg-white/10 rounded-2xl border border-indigo-500/20 dark:border-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="text-sm font-medium relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 pt-0">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors duration-300"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Topbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="w-full h-20 flex items-center justify-between px-8 z-30 sticky top-0 bg-zinc-50/60 dark:bg-[#09090b]/60 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-50 dark:border-[#09090b]"></span>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10"
              >
                <div className="p-4 border-b border-zinc-200 dark:border-white/5">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Notifications</h3>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Project "Web App" Approved</p>
                      <p className="text-xs text-zinc-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FolderGit2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">You were added to a project</p>
                      <p className="text-xs text-zinc-500">Yesterday</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-zinc-200 dark:border-white/5 text-center">
                  <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-zinc-200 dark:bg-white/10 mx-1 transition-colors"></div>
        
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400"
          >
            <User size={16} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 p-2"
              >
                <div className="px-3 py-2 mb-2 border-b border-zinc-200 dark:border-white/5">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Sanjeev Kumar</p>
                  <p className="text-xs text-zinc-500">sanjeev@taskflow.app</p>
                </div>
                
                <Link 
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors w-full text-left"
                >
                  <Settings size={16} /> Account Settings
                </Link>
                
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors w-full text-left mt-1"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Background base that transitions smoothly between light/dark */}
        <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300 relative">
          
          {/* Subtle light mode background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-zinc-50 to-zinc-50 dark:hidden pointer-events-none"></div>

          <Routes>
            {/* Auth Routes without Sidebar */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Main App Routes with Sidebar */}
            <Route
              path="/*"
              element={
                <div className="flex w-full min-h-screen">
                  <Sidebar />
                  <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen relative z-10">
                    <Topbar />
                    <main className="flex-1 p-8 overflow-y-auto">
                      <PageWrapper>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/projects" element={<Projects />} />
                          <Route path="/tasks" element={<Tasks />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                      </PageWrapper>
                    </main>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
