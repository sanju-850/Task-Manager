import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Activity } from "lucide-react";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      // Dummy navigation for UI demonstration
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl premium-border bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight transition-colors">Welcome back</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm transition-colors">Enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-indigo-600 dark:bg-white text-white dark:text-black font-semibold rounded-2xl py-3.5 mt-4 flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-none"
            >
              Sign In <ArrowRight size={18} />
            </motion.button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400 font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
