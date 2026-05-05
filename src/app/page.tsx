"use client";
import React, { useState, useEffect } from 'react';

export default function OmniSearchDashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(84);

  // Simulating live progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 99 ? prev + 0.1 : prev));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const startAnalysis = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const responses = [
        `Deep analysis complete for source: ${query}. Detected architectural bottleneck in Long-Horizon Memory (LHM). The cross-attention mechanism shows 14.2% inefficiency when processing multimodal tokens exceeding 10M context.`,
        `Synthesis Engine has mapped 12,400 entities. Recommendation: Implement Structured Anchoring to mitigate conversational drift. Token demand for full recursive synthesis: 1.2 Quadrillion.`,
        `OmniSearch AI detected a pattern of 'Temporal Re-Entry'. Latency in current MiMo 2.0 architecture is 45ms higher than expected for real-time synthesis. Upgrade to MiMo 100T mandatory.`
      ];
      setResult(responses[Math.floor(Math.random() * responses.length)]);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-red-500/30">
      {/* Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] pointer-events-none"></div>

      <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
            <div className="w-5 h-5 border-2 border-white/80 rotate-45"></div>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Omni<span className="text-red-500">Search</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <span className="hover:text-white cursor-pointer transition">Network</span>
            <span className="hover:text-white cursor-pointer transition">Vault</span>
            <span className="hover:text-white cursor-pointer transition">Docs</span>
          </div>
          <button className="px-5 py-2.5 bg-white text-black text-xs font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
            ACCESS TERMINAL
          </button>
        </div>
      </nav>

      <main className="relative flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-red-500/5 border border-red-500/20 text-red-400 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>MiMo V2.5 Stable Entry</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 max-w-5xl leading-[0.9] tracking-tighter italic">
          DECODE <span className="text-red-500 non-italic">REALITY</span><br />
          <span className="text-gray-500 italic">AT SCALE.</span>
        </h1>
        
        <p className="text-gray-400 max-w-xl text-lg mb-12 leading-relaxed font-medium">
          The next-gen autonomous research engine. Synthesize multimodal datasets into actionable intelligence with zero context fragmentation.
        </p>

        <div className="relative w-full max-w-3xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row p-2 bg-[#0a0a0a] border border-white/10 rounded-xl">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Inject research URL or dataset CID..." 
              className="flex-grow px-6 py-4 bg-transparent text-lg focus:outline-none placeholder:text-gray-700"
            />
            <button 
              onClick={startAnalysis}
              disabled={loading}
              className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>SCANNING...</span>
                </>
              ) : (
                <span>ANALYZE</span>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-12 p-8 bg-red-500/5 border border-red-500/20 rounded-2xl max-w-3xl text-left backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">Synthesis Result</h3>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed font-serif italic">"{result}"</p>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Entropy: 0.042</span>
              <span>Confidence: 99.8%</span>
              <span>Tokens: 14.2M</span>
            </div>
          </div>
        )}
      </main>

      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(255,0,0,0.1)]">
          <div className="p-5 bg-white/5 flex justify-between items-center border-b border-white/5">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
              <div className="w-3 h-3 rounded-full bg-[#333]"></div>
            </div>
            <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase">System Status: Nominal</div>
            <div className="text-[10px] font-black tracking-widest text-red-500 uppercase">{progress.toFixed(1)}% INDEXED</div>
          </div>
          
          <div className="grid grid-cols-12 min-h-[500px]">
            <aside className="col-span-3 border-r border-white/5 p-8 flex flex-col space-y-10">
              <div>
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">Neural Agents</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Synthesis Manager', status: 'Active', color: 'bg-green-500' },
                    { name: 'Data Harvester', status: 'Running', color: 'bg-green-500' },
                    { name: 'Vector Analyst', status: 'Standby', color: 'bg-gray-600' },
                    { name: 'Vision Engine', status: 'Offline', color: 'bg-red-500/20' }
                  ].map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between group cursor-help">
                      <div className="flex items-center space-x-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${agent.color} ${agent.status !== 'Offline' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition">{agent.name}</span>
                      </div>
                      <span className="text-[9px] font-black text-gray-600 uppercase">{agent.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">Resource Load</p>
                    <span className="text-[10px] text-white font-black italic">LIMIT</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 h-full w-[98%] animate-pulse"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase">
                    Critical: Upgrade to MiMo 100T Plan required for full recursive depth.
                  </p>
                </div>
              </div>
            </aside>

            <div className="col-span-9 p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Omni<span className="text-red-500">Node</span>-01</h2>
                  <p className="text-sm text-gray-500 font-medium">Monitoring 1,240 documents / 14.2M tokens</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-black text-white italic tracking-tighter">{progress.toFixed(0)}%</div>
                  <div className="text-[10px] text-gray-600 font-black uppercase">Sync Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-red-500/30 transition-colors">
                    <div className="w-8 h-1 bg-red-500 mb-4"></div>
                    <p className="text-sm text-gray-400 leading-relaxed font-serif">
                      "Cross-platform propagation of autonomous agent workflows requires a unified memory protocol. Current constraints limit recursive depth."
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-grow h-32 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-end">
                      <div className="h-1 w-full bg-white/10 rounded-full mb-2"></div>
                      <div className="h-1 w-2/3 bg-white/10 rounded-full mb-2"></div>
                      <div className="h-1 w-1/2 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="w-32 h-32 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                       <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 flex flex-col">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Live Logs</h4>
                  <div className="space-y-3 font-mono text-[10px] text-gray-600 overflow-hidden">
                    <div className="flex space-x-2"><span className="text-green-500">[OK]</span> <span>MNGR_INIT_SUCCESS</span></div>
                    <div className="flex space-x-2"><span className="text-green-500">[OK]</span> <span>HARVESTER_BATCH_SYNC</span></div>
                    <div className="flex space-x-2"><span className="text-red-500">[ERR]</span> <span>MIMO_TOKEN_EXHAUSTED</span></div>
                    <div className="flex space-x-2"><span className="text-yellow-500">[WRN]</span> <span>LHM_RETRY_BACKOFF</span></div>
                    <div className="animate-pulse">_</div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-red-500 italic">
                    <span>V2.5.0-STABLE</span>
                    <span>SECURE_NODE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-4">OmniSearch Research Lab &copy; 2026</div>
        <div className="flex justify-center space-x-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <span className="hover:text-red-500 cursor-pointer">Protocol</span>
          <span className="hover:text-red-500 cursor-pointer">Privacy</span>
          <span className="hover:text-red-500 cursor-pointer">MiMo-Auth</span>
        </div>
      </footer>
    </div>
  );
}
