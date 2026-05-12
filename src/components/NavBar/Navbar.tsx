import { Heart, Timer, CheckCircle2, Calendar, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navbar.css';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const tabs = [
    { id: 'timer', icon: <Timer size={13} />, label: 'Foco' },
    { id: 'tasks', icon: <CheckCircle2 size={13} />, label: 'Tasks' },
    { id: 'calendar', icon: <Calendar size={13} />, label: 'Agenda' },
    { id: 'google', icon: <Cloud size={13} />, label: 'Google' }
  ];

  return (
    <header className="navbar-header">
      {/* Coração agora posicionado à esquerda da navegação */}
      <div className="heart-brand">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            filter: ["drop-shadow(0px 0px 0px rgba(255,139,148,0))", "drop-shadow(0px 0px 5px rgba(255,139,148,0.3))", "drop-shadow(0px 0px 0px rgba(255,139,148,0))"]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut" 
          }}
        >
          <Heart fill="#FF8B94" color="#FF8B94" size={24} />
        </motion.div>
      </div>

      <nav className="nav-pill-container">
        <motion.div
          className="nav-indicator"
          initial={false}
          animate={{
            width: `${100 / tabs.length}%`,
            x: `${tabs.findIndex(t => t.id === activeTab) * 100}%`
          }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
};