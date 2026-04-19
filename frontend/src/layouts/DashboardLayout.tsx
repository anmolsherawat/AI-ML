import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, BrainCircuit, FileText, ArrowLeft, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

const MagneticLink = ({ children, className, onClick, isActive }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/dashboard/explorer', label: 'Data Explorer', icon: LineChart },
    { path: '/dashboard/predict', label: 'Predict Yield', icon: BrainCircuit },
    { path: '/dashboard/advisory', label: 'AI Advisory', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-white/30 selection:text-white">
      {/* Sidebar - Pure glass over black */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-72 border-r border-white/[0.08] glass-panel rounded-none flex flex-col z-20"
      >
        <div className="p-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center border-white/20 group-hover:bg-white transition-colors duration-500">
              <Leaf className="w-4 h-4 text-white group-hover:text-black transition-colors duration-500" />
            </div>
            AGRIVISION
          </motion.div>
        </div>

        <div className="px-6 mb-4 text-xs font-bold text-white/30 tracking-widest uppercase">
          Menu
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <MagneticLink
                  onClick={() => navigate(link.path)}
                  isActive={isActive}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-500 relative overflow-hidden group ${
                    isActive 
                      ? 'text-black font-bold bg-white shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                      : 'text-white/50 hover:text-white font-medium hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-black' : 'group-hover:scale-110 transition-transform duration-500'}`} />
                  <span className="text-sm tracking-wide relative z-10 uppercase">{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute inset-0 bg-white"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  )}
                </MagneticLink>
              </motion.div>
            );
          })}
        </nav>
        
        <div className="p-8 border-t border-white/[0.08]">
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors duration-500"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Ambient background for content area */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[150px] pointer-events-none" 
        />
        
        <div className="p-10 max-w-7xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
