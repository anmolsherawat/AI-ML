import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  CloudRain, 
  Sprout,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const dummyData = [
  { year: 1990, yield: 20000, temp: 20, rain: 800 },
  { year: 1995, yield: 22000, temp: 20.5, rain: 750 },
  { year: 2000, yield: 25000, temp: 21, rain: 820 },
  { year: 2005, yield: 30000, temp: 21.2, rain: 790 },
  { year: 2010, yield: 35000, temp: 21.8, rain: 850 },
  { year: 2015, yield: 42000, temp: 22.1, rain: 880 },
  { year: 2020, yield: 48000, temp: 22.5, rain: 900 },
];

const topCrops = [
  { name: 'Potatoes', value: 420000 },
  { name: 'Sweet potatoes', value: 140000 },
  { name: 'Cassava', value: 120000 },
  { name: 'Yams', value: 90000 },
  { name: 'Maize', value: 50000 },
];

export default function Explorer() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      // Here you would normally parse the CSV and update the dummyData state
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-3 uppercase">Data Explorer</h1>
          <p className="text-white/40 font-mono text-sm max-w-2xl">Interactive visualization of historical crop yield trends across a comprehensive global dataset.</p>
        </motion.div>
        
        {/* Upload Zone */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging 
              ? 'border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
              : 'border-white/20 glass-panel hover:bg-white/[0.05] hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]'
          }`}
        >
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging || file ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
            {file ? <FileSpreadsheet className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">{file ? 'File Uploaded' : 'Upload Custom CSV'}</h4>
            <p className="text-xs text-white/40 font-mono mt-1">
              {file ? file.name : 'Drag & drop or click to browse'}
            </p>
          </div>
        </motion.div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl glass-panel relative overflow-hidden group hover:bg-white/[0.05] transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16 text-white" />
          </div>
          <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-2">Total Records</p>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter font-mono">28,242</h2>
          <p className="text-xs text-white mt-2 flex items-center gap-2 font-mono uppercase tracking-wide">
            <TrendingUp className="w-3 h-3"/> Global Dataset
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl glass-panel relative overflow-hidden group hover:bg-white/[0.05] transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <MapPin className="w-16 h-16 text-white" />
          </div>
          <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-2">Countries</p>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter font-mono">101</h2>
          <p className="text-xs text-white/30 mt-2 font-mono uppercase tracking-wide">Across 6 Continents</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl glass-panel relative overflow-hidden group hover:bg-white/[0.05] transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sprout className="w-16 h-16 text-white" />
          </div>
          <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-2">Crop Types</p>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter font-mono">10</h2>
          <p className="text-xs text-white/30 mt-2 font-mono uppercase tracking-wide">Major Staples</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-2xl glass-panel relative overflow-hidden group hover:bg-white/[0.05] transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CloudRain className="w-16 h-16 text-white" />
          </div>
          <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-2">Data Span</p>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter font-mono">1990<span className="text-2xl text-white/30">-2013</span></h2>
          <p className="text-xs text-white/30 mt-2 font-mono uppercase tracking-wide">Climate Correlation</p>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 p-8 rounded-3xl glass-panel relative group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500"
        >
          <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Global Yield Timeline (hg/ha)
          </h3>
          <div className="h-[350px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="year" stroke="#ffffff40" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff40" tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="yield" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart Top Crops */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 rounded-3xl glass-panel group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500"
        >
          <h3 className="text-sm font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Top Yielding Crops
          </h3>
          <div className="h-[350px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCrops} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff40" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {topCrops.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}