import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Activity } from "lucide-react";
import API from "../api/axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password, role });
      // The backend /signup might not return a token, so we can just redirect to login
      // Or if it returns a user, store it (but standard is they log in after signup)
      navigate("/");
    } catch (error) {
      console.log(error);
      // Dummy navigation for UI demo
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl premium-border bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-6">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight transition-colors">Create an account</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm transition-colors">Join TaskFlow to manage your team.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Account Type</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 shadow-sm appearance-none cursor-pointer transition-all"
              >
                <option value="Admin">Workspace Admin</option>
                <option value="Member">Team Member</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-indigo-600 dark:bg-white text-white dark:text-black font-semibold rounded-2xl py-3.5 mt-6 flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-none"
            >
              Sign Up <ArrowRight size={18} />
            </motion.button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Already have an account? <Link to="/" className="text-indigo-600 dark:text-white hover:text-indigo-700 dark:hover:text-purple-400 font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
