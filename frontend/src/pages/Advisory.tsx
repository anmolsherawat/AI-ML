import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Download, RefreshCw, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MagneticButton = ({ children, className, onClick, disabled }: any) => {
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
    >
      {children}
    </motion.button>
  );
};

export default function Advisory() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const copyToClipboard = () => {
    if (report) {
      navigator.clipboard.writeText(report);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on A4 size and maintain aspect ratio
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add a slight margin
      const margin = 20;
      
      pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth - (margin * 2), pdfHeight - (margin * 2));
      pdf.save('AgriVision-Advisory-Report.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // Default values to match the Predict page for the demo
      const requestData = {
        item: "Maize",
        area: "India",
        avg_temp: 22.5,
        rainfall: 1200.0,
        pesticides: 150.0,
        year: 2024
      };

      console.log('Sending Advisory request data:', requestData);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/advisory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        let errorMsg = 'Failed to generate advisory report';
        if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setReport(data.report);
    } catch (error: any) {
      console.error('Advisory error:', error);
      alert(`Failed to generate advisory report: ${error.message}. Please ensure the backend is running on port 8000 and your API key is valid.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-10"
    >
      <header className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-bold tracking-tighter text-white mb-3 uppercase flex items-center justify-center gap-4"
        >
          <Bot className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          AI Farm Advisory
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 max-w-2xl mx-auto font-mono text-sm"
        >
          Receive structured, actionable crop management recommendations powered by LangGraph and Groq.
        </motion.p>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-12"
      >
        <MagneticButton 
          onClick={generateReport}
          disabled={loading}
          className="group flex items-center gap-4 px-12 py-6 rounded-2xl bg-white text-black font-bold tracking-[0.1em] uppercase hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Processing Data...</>
          ) : (
            <><Bot className="w-5 h-5 group-hover:scale-110 transition-transform" /> Generate Advisory Report</>
          )}
        </MagneticButton>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 max-w-3xl mx-auto p-10 glass-panel rounded-3xl"
          >
            <div className="h-8 w-1/3 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-full bg-white/5 rounded animate-pulse delay-75" />
            <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse delay-100" />
            <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse delay-150" />
            
            <div className="h-8 w-1/4 bg-white/5 rounded animate-pulse mt-12" />
            <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
            
            <div className="flex items-center justify-center pt-10 text-white text-sm font-bold tracking-widest uppercase animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin mr-3" />
              Agent reasoning over farm data...
            </div>
          </motion.div>
        )}

        {report && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex justify-end mb-6 gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg glass-panel hover:bg-white text-white hover:text-black text-sm font-bold uppercase tracking-widest transition-colors duration-500"
              >
                <FileText className="w-4 h-4" />
                Copy Text
              </button>
              <button 
                onClick={exportToPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>

            {/* Report Paper */}
            <div ref={reportRef} className="glass-panel rounded-3xl p-10 md:p-16 relative overflow-hidden bg-black">
              <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_20px_#ffffff]" />
              
              <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/10">
                <CheckCircle2 className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">Analysis Complete</h2>
              </div>

              {/* Rendered Markdown Area */}
              <div className="prose prose-invert max-w-none">
                {report.split('\n').map((line, i) => {
                  if (line.startsWith('###')) {
                    return <h3 key={i} className="text-white font-bold text-xl mt-12 mb-6 flex items-center gap-3 tracking-tight uppercase">
                      <div className="w-2 h-2 rounded-full bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      {line.replace('### ', '')}
                    </h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-white/70 font-mono text-sm ml-6 mb-3 leading-relaxed">{line.replace('- ', '')}</li>;
                  }
                  if (line.match(/^\d+\./)) {
                    return <li key={i} className="text-white/70 font-mono text-sm ml-6 mb-3 leading-relaxed">{line.replace(/^\d+\.\s/, '')}</li>;
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="text-white/60 font-mono text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-sans font-bold">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>')}} />;
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}