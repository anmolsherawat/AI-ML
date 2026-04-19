import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Beaker, CloudRain, Sun, Calendar, Wheat, Calculator, Sprout } from 'lucide-react';

const MagneticButton = ({ children, className, onClick, disabled, type }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (disabled) return;
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
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default function Predict() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { yield: number, tonnes: number }>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const requestData = {
        item: formData.get('crop'),
        area: formData.get('country'),
        avg_temp: parseFloat(formData.get('temp') as string),
        rainfall: parseFloat(formData.get('rain') as string),
        pesticides: parseFloat(formData.get('pesticides') as string),
        year: parseInt(formData.get('year') as string, 10)
      };

      console.log('Sending request data:', requestData);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      setResult({ yield: Math.round(data.yield_hg_ha), tonnes: parseFloat(data.yield_tonnes_ha.toFixed(2)) });
    } catch (error: any) {
      console.error('Prediction error:', error);
      alert(`Failed to get prediction: ${error.message}. Please ensure the backend is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      <header className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-bold tracking-tighter text-white mb-3 uppercase"
        >
          Yield Prediction Engine
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 max-w-2xl mx-auto font-mono text-sm"
        >
          Input your farm's environmental and historical data to receive highly accurate yield estimations powered by our ML model.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-3xl glass-panel"
        >
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest mb-6">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Parameters
              </h3>

              {/* Crop Type */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wheat className="h-5 w-5 text-white/30 group-focus-within:text-white transition-colors" />
                </div>
                <select name="crop" defaultValue="Maize" className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all cursor-pointer">
                  <option value="Maize">Maize</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Potatoes">Potatoes</option>
                </select>
              </div>

              {/* Country */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CloudRain className="h-5 w-5 text-white/30 group-focus-within:text-white transition-colors" />
                </div>
                <select name="country" defaultValue="India" className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all cursor-pointer">
                  <option value="India">India</option>
                  <option value="United States of America">United States</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                </select>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-3">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-2"><Sun className="w-3 h-3 text-white"/> Avg Temp</label>
                  <input name="temp" type="number" step="0.1" defaultValue={22.5} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-2"><CloudRain className="w-3 h-3 text-white"/> Rainfall</label>
                  <input name="rain" type="number" step="0.1" defaultValue={1200} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-2"><Beaker className="w-3 h-3 text-white"/> Pesticides</label>
                  <input name="pesticides" type="number" step="0.1" defaultValue={150} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3 text-white"/> Year</label>
                  <input name="year" type="number" defaultValue={2024} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all" />
                </div>
              </div>
            </div>

            <MagneticButton 
              disabled={loading}
              type="submit"
              className="w-full relative overflow-hidden group bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] text-black font-bold py-5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate Yield
                  </>
                )}
              </span>
            </MagneticButton>
          </form>
        </motion.div>

        {/* Results Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center p-8 rounded-3xl glass-panel text-white/30"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-white/30" />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting Parameters...</p>
              </motion.div>
            ) : loading ? (
               <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 rounded-3xl glass-panel relative overflow-hidden border-white/30"
              >
                {/* Scanning line animation */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_20px_#ffffff] z-10"
                />
                <Activity className="w-16 h-16 text-white animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                <p className="text-white font-bold tracking-widest uppercase text-sm animate-pulse">Running Inference Pipeline...</p>
              </motion.div>
            ) : result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col p-10 rounded-3xl glass-panel border-white/30 white-glow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sprout className="w-48 h-48 text-white" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-12">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Prediction Success
                  </div>
                  
                  <div className="mb-12">
                    <p className="text-white/40 font-bold tracking-widest uppercase text-xs mb-4">Estimated Yield</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-7xl font-bold text-white tracking-tighter">
                        {result.yield.toLocaleString()}
                      </h2>
                      <span className="text-white font-mono font-bold">hg/ha</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-black border border-white/10">
                    <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-2">Standard Conversion</p>
                    <p className="text-3xl font-bold text-white font-mono">{result.tonnes} <span className="text-lg text-white/30 font-sans tracking-normal">tonnes/ha</span></p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
}
