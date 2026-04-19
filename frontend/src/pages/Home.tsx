import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Leaf, ArrowRight, Droplets, Beaker, Sprout, Network, Zap, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

const MagneticButton = ({ children, className, onClick }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
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

const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 4 }: any) => (
  <motion.div
    animate={{ y: [0, -yOffset, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, body, delay = 0, offsetClassName = '' }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    className={offsetClassName}
  >
    <motion.div
      whileHover={{ x: 6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative flex items-start gap-8 p-10 rounded-[2rem] glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-500 group"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all duration-500">
        <Icon className="w-6 h-6 text-white group-hover:text-black transition-colors duration-500" />
      </div>
      <div>
        <h3 className="text-white font-bold text-xl tracking-widest uppercase mb-3">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed font-mono">{body}</p>
        <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest group-hover:text-white transition-colors duration-500 cursor-pointer">
          Interactive Insights <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const yHero = useTransform(smoothScrollY, [0, 1], [0, 300]);
  const opacityHero = useTransform(smoothScrollY, [0, 0.3], [1, 0]);
  const scaleHero = useTransform(smoothScrollY, [0, 0.3], [1, 0.95]);

  const yGrid = useTransform(smoothScrollY, [0, 1], [100, -100]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToExplore = () => {
    const el = document.getElementById('explore');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-black text-white selection:bg-white/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: mousePos.x * -30, y: mousePos.y * -30 }}
          transition={{ type: "spring", stiffness: 50, damping: 50 }}
          className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] rounded-full bg-white/[0.03] blur-[150px]" 
        />
        <motion.div 
          animate={{ x: mousePos.x * 30, y: mousePos.y * 30 }}
          transition={{ type: "spring", stiffness: 50, damping: 50 }}
          className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] rounded-full bg-white/[0.03] blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 px-8 py-6 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold text-xl md:text-2xl tracking-tighter group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <Leaf className="w-5 h-5" />
            </div>
            <span>AGRIVISION</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all">Dashboard</button>
            <button onClick={() => navigate('/dashboard/predict')} className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all">Predict</button>
            <button onClick={() => navigate('/dashboard/advisory')} className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all">Advisory</button>
          </div>

          <MagneticButton 
            onClick={() => navigate('/dashboard')}
            className="hidden md:block px-8 py-3 rounded-full bg-white text-black text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow duration-500"
          >
            Launch System
          </MagneticButton>
        </div>
      </motion.nav>

      <main className="relative z-10 flex flex-col items-center pt-[30vh] min-h-[120vh] px-4 text-center">
        <motion.div style={{ y: yHero, opacity: opacityHero, scale: scaleHero }} className="max-w-6xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            AI-Driven Agronomy v2.0
          </motion.div>

          <div className="relative mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[8rem] font-bold tracking-tighter text-white leading-[0.9]"
            >
              PREDICT THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-black relative inline-block">
                FUTURE HARVEST.
                <motion.div 
                  animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[1px] bg-white shadow-[0_0_10px_#ffffff] z-10"
                />
              </span>
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mb-16 font-light leading-relaxed font-mono"
          >
            Eliminate guesswork. Leverage advanced Random Forest models and LangGraph AI agents to transform historical weather, soil, and crop data into precision yield analytics.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <MagneticButton 
              onClick={() => navigate('/dashboard/predict')}
              className="group flex items-center gap-4 px-12 py-6 rounded-2xl bg-white text-black font-bold tracking-[0.1em] uppercase hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-500"
            >
              Start Predicting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </MagneticButton>
            
            <button 
              onClick={scrollToExplore}
              className="px-12 py-6 rounded-2xl glass-panel text-white font-bold tracking-[0.1em] uppercase hover:bg-white hover:text-black transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">Explore Data</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute top-[20%] left-[10%] opacity-20 pointer-events-none hidden lg:block">
          <FloatingElement delay={0} duration={6} yOffset={30}>
            <Network className="w-24 h-24 text-white" />
          </FloatingElement>
        </div>
        <div className="absolute top-[40%] right-[10%] opacity-20 pointer-events-none hidden lg:block">
          <FloatingElement delay={1.5} duration={7} yOffset={40}>
            <ShieldAlert className="w-16 h-16 text-white" />
          </FloatingElement>
        </div>
        <div className="absolute bottom-[20%] left-[20%] opacity-20 pointer-events-none hidden lg:block">
          <FloatingElement delay={0.5} duration={5} yOffset={25}>
            <Zap className="w-20 h-20 text-white" />
          </FloatingElement>
        </div>
      </main>

      <section id="explore" className="relative z-10 bg-black pb-32 px-4 border-t border-white/5">
        <motion.div style={{ y: yGrid }} className="max-w-7xl mx-auto -mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
              <div className="glass-panel rounded-[2rem] p-12 border-white/10 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition-all duration-700">
                <div className="text-xs font-mono text-white/30 tracking-[0.35em] uppercase flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Explore Data
                </div>
                <h2 className="mt-8 text-5xl font-bold tracking-tighter uppercase leading-[1.1]">Intelligence <br /> you can see.</h2>
                <p className="mt-8 text-white/40 font-mono text-sm leading-relaxed">
                  Your dataset becomes a visual system: patterns, risk signals, and yield drivers—rendered as motion, structure, and clarity.
                </p>
                <div className="mt-12 flex flex-col xl:flex-row items-start xl:items-center gap-4">
                  <MagneticButton
                    onClick={() => navigate('/dashboard/explorer')}
                    className="px-8 py-4 rounded-2xl bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(255,255,255,0.45)] transition-shadow duration-500 w-full xl:w-auto"
                  >
                    Open Explorer
                  </MagneticButton>
                  <button 
                    onClick={() => navigate('/dashboard/explorer')}
                    className="px-6 py-4 rounded-2xl glass-panel text-white/50 text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 w-full xl:w-auto"
                  >
                    Upload CSV Inside
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <FeatureCard
                icon={Droplets}
                title="Climate Intel"
                body="Process decades of historical rainfall and temperature patterns to understand their precise correlation with vegetative development stages."
                delay={0.1}
              />
              <FeatureCard
                icon={Beaker}
                title="Input Efficiency"
                body="Measure exact correlations between pesticide/fertilizer application rates and ultimate crop yield outputs to minimize chemical dependency."
                delay={0.2}
              />
              <FeatureCard
                icon={Sprout}
                title="Agentic Advisory"
                body="State-of-the-art LangGraph AI workflow that reasons over your specific farm metrics to generate structured, actionable agronomy reports."
                delay={0.3}
              />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
