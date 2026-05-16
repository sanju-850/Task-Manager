import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Users, Save, Image as ImageIcon, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Modal } from "../components/Modal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'team', label: 'Team', icon: Users },
];

function Settings() {
  const [activeTab, setActiveTab] = useState('team');
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "Admin", name: "Sanjeev Kumar", email: "sanjeev@taskflow.app" };
  const currentUserRole = user.role;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto pb-12"
    >
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2 transition-colors">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 transition-colors">Manage your account settings and preferences.</p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative text-sm font-medium ${
                    isActive ? 'text-indigo-600 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-active-tab"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Tab Content Area */}
        <div className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileTab user={user} />}
              {activeTab === 'preferences' && <PreferencesTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'team' && <TeamTab currentUserRole={currentUserRole} />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

function ProfileTab({ user }) {
  const firstName = user.name.split(" ")[0] || "";
  const lastName = user.name.split(" ").slice(1).join(" ") || "";

  return (
    <div className="glass-panel rounded-3xl p-8 shadow-xl">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 transition-colors">Profile Information</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-zinc-200 dark:border-white/5 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden transition-colors">
             <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">{firstName.charAt(0)}</span>
          </div>
          <button className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 rounded-lg transition-colors border border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-zinc-300">
            <ImageIcon size={14} /> Change Avatar
          </button>
        </div>
        
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">First Name</label>
              <input type="text" defaultValue={firstName} className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Last Name</label>
              <input type="text" defaultValue={lastName} className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
            <input type="email" defaultValue={user.email} className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-zinc-500 dark:text-zinc-400 cursor-not-allowed shadow-inner transition-colors" disabled />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-[0_0_20px_rgba(79,70,229,0.2)]">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="glass-panel rounded-3xl p-8 shadow-xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Notifications</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 transition-colors">Choose what you want to be notified about.</p>
        
        <div className="space-y-4">
          <ToggleItem title="Email Notifications" desc="Receive daily summaries and critical alerts via email." defaultChecked={true} />
          <ToggleItem title="Push Notifications" desc="Get instant alerts in your browser for new assignments." defaultChecked={true} />
          <ToggleItem title="Overdue Task Warnings" desc="Alert me 24 hours before a task becomes overdue." defaultChecked={false} />
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-200 dark:border-white/5 transition-colors">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Appearance</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 transition-colors">Customize the look and feel of your workspace.</p>
        
        <div className="flex gap-4">
          <div 
            onClick={() => setTheme('light')}
            className={`border-2 rounded-xl p-1 bg-zinc-50 dark:bg-white/5 cursor-pointer transition-colors ${theme === 'light' ? 'border-indigo-500' : 'border-transparent hover:border-zinc-300 dark:hover:border-white/20'}`}
          >
            <div className="w-32 h-20 bg-white rounded-lg border border-zinc-200 shadow-sm flex flex-col p-2 gap-1">
              <div className="w-1/2 h-2 bg-zinc-200 rounded" />
              <div className="w-full h-2 bg-indigo-500/50 rounded" />
            </div>
            <p className={`text-center text-xs mt-2 font-medium ${theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}>Light</p>
          </div>

          <div 
            onClick={() => setTheme('dark')}
            className={`border-2 rounded-xl p-1 bg-zinc-50 dark:bg-white/5 cursor-pointer transition-colors ${theme === 'dark' ? 'border-indigo-500' : 'border-transparent hover:border-zinc-300 dark:hover:border-white/20'}`}
          >
            <div className="w-32 h-20 bg-[#09090b] rounded-lg border border-white/10 flex flex-col p-2 gap-1">
              <div className="w-1/2 h-2 bg-white/10 rounded" />
              <div className="w-full h-2 bg-indigo-500/50 rounded" />
            </div>
            <p className={`text-center text-xs mt-2 font-medium ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}>Dark</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="glass-panel rounded-3xl p-8 shadow-xl">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 transition-colors">Security Settings</h2>
      
      <div className="space-y-5 max-w-md mb-8 pb-8 border-b border-zinc-200 dark:border-white/5 transition-colors">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Current Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm dark:shadow-inner" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">New Password</label>
          <input type="password" placeholder="Enter new password" className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm dark:shadow-inner" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 transition-colors">Two-Factor Authentication</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 transition-colors">Add an extra layer of security to your account.</p>
        <button className="bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Enable 2FA
        </button>
      </div>
    </div>
  );
}

function TeamTab({ currentUserRole }) {
  const [members, setMembers] = useState([
    { id: 1, name: 'Sanjeev Kumar', email: 'sanjeev@taskflow.app', role: 'Admin' },
    { id: 2, name: 'Alice Smith', email: 'alice@taskflow.app', role: 'Member' },
    { id: 3, name: 'Bob Johnson', email: 'bob@taskflow.app', role: 'Member' },
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Member' });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    // Simulate name generation from email prefix
    const namePrefix = inviteForm.email.split('@')[0];
    const generatedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
    
    const newMember = {
      id: Date.now(),
      name: generatedName,
      email: inviteForm.email,
      role: inviteForm.role
    };

    setMembers(prev => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteForm({ email: '', role: 'Member' });
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setIsEditOpen(false);
  };

  const handleRemoveMember = () => {
    setMembers(prev => prev.filter(m => m.id !== editingMember.id));
    setIsEditOpen(false);
  };

  return (
    <>
      <div className="glass-panel rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 transition-colors">Team Management</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
              {currentUserRole === 'Admin' ? 'Invite new members and manage roles.' : 'View your workspace team members.'}
            </p>
          </div>
          {currentUserRole === 'Admin' && (
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
            >
              Invite Member
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-zinc-200 dark:hover:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors">{member.name}</p>
                  <p className="text-xs text-zinc-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${member.role === 'Admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400'} transition-colors`}>
                  {member.role}
                </span>
                {currentUserRole === 'Admin' && (
                  <button 
                    onClick={() => openEditModal(member)}
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 px-2 py-1"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
              No team members found. Invite someone to collaborate!
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
              placeholder="colleague@company.com"
              className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-white/10 transition-all shadow-sm dark:shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Role</label>
            <select 
              value={inviteForm.role}
              onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
              className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer"
            >
              <option value="Member">Member (Can edit tasks and projects)</option>
              <option value="Admin">Admin (Full access, can manage billing)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsInviteOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/30"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Manage Member">
        {editingMember && (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {editingMember.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{editingMember.name}</p>
                <p className="text-sm text-zinc-500">{editingMember.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Workspace Role</label>
              <select 
                value={editingMember.role}
                onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                className="w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl py-3 px-4 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 shadow-sm appearance-none cursor-pointer"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-zinc-200 dark:border-white/5">
              <button 
                type="button"
                onClick={handleRemoveMember}
                className="flex items-center gap-2 px-3 py-2 mt-4 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} /> Remove from workspace
              </button>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/30"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

// Reusable Toggle Component
function ToggleItem({ title, desc, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 transition-colors shadow-sm dark:shadow-none">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 mb-0.5 transition-colors">{title}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
      >
        <motion.div 
          layout
          className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
          initial={false}
          animate={{ left: checked ? 'calc(100% - 20px)' : '4px' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

export default Settings;
