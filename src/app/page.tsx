"use client";
import React, { useState } from 'react';

export default function Page() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    if (!query) return alert('Input detailnya dulu, Bos.');
    setLoading(true);
    setStatus('Initializing Agents...');

    setTimeout(() => {
      const responses = [
        "Deep analysis complete. Detected architectural bottleneck in Long-Horizon Memory (LHM). The cross-attention mechanism shows 14.2% inefficiency when processing multimodal tokens exceeding 10M context.",
        "Synthesis Engine has mapped 12,400 entities. Recommendation: Implement Structured Anchoring to mitigate conversational drift. Token demand for full recursive synthesis: 1.2 Quadrillion.",
        "OmniSearch AI detected a pattern of 'Temporal Re-Entry'. Latency in current MiMo 2.0 architecture is 45ms higher than expected for real-time synthesis. Upgrade to MiMo 100T mandatory."
      ];
      setStatus(responses[Math.floor(Math.random() * responses.length)]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans flex flex-col">
      <style jsx global>{`
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#ff3333] rounded-sm"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">OMNI<span className="text-[#ff3333]">SEARCH</span></span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <span className="hover:text-white transition cursor-pointer">Features</span>
          <span className="hover:text-white transition cursor-pointer">Research</span>
          <span className="hover:text-white transition cursor-pointer">API</span>
          <span className="text-gray-600 cursor-not-allowed">v2.5 Stable</span>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-sm hover:bg-gray-200 transition">Launch App</button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-gray-900 border border-gray-800 rounded-full mb-6 text-gray-400">
          Powered by Xiaomi MiMo V2.5
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 max-w-4xl leading-tight">
          Synthesize <span className="text-[#ff3333]">Massive</span> Data <br />in Seconds.
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg mb-10 leading-relaxed">
          The world's first multi-agent autonomous research engine designed for long-context multimodal analysis. Transform thousands of documents into actionable intelligence.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-2xl justify-center">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter research URL or upload PDF..." 
            className="w-full md:w-96 px-6 py-4 glass rounded-sm focus:outline-none focus:border-[#ff3333] transition"
          />
          <button 
            onClick={startAnalysis}
            className="px-8 py-4 bg-[#ff3333] text-white font-bold rounded-sm hover:brightness-110 transition shadow-lg shadow-red-900/20"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {status && (
          <div className="mt-8 p-4 glass rounded border border-[#ff3333]/20 max-w-2xl text-left animate-in fade-in duration-500">
            <p className="text-sm text-gray-300">
              <span className="text-[#ff3333] font-bold uppercase tracking-wider">Analysis Result:</span><br/>
              {status}
            </p>
          </div>
        )}
      </main>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto glass rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 bg-gray-900 flex items-center space-x-2 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500 ml-4">app.omnisearch.ai / research / project-hermes-synthesis</span>
          </div>
          <div className="grid grid-cols-12 h-[500px]">
            <aside className="col-span-3 border-r border-gray-800 p-6 flex flex-col space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Agents Active</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Synthesis Manager</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Data Harvester</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <span>Vision Analyst (IDLE)</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <div className="p-4 bg-red-950/20 border border-red-900/30 rounded">
                  <p className="text-[10px] text-red-400 uppercase font-bold mb-1">Token Usage</p>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#ff3333] h-full w-[85%]"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">Critical: Upgrade to MiMo 100T Plan</p>
                </div>
              </div>
            </aside>
            <div className="col-span-9 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Research Synthesis: Multi-Agent Deep Dive</h2>
                  <p className="text-sm text-gray-500">Analyzing 1,240 documents (14.2M tokens)</p>
                </div>
                <span className="px-3 py-1 bg-gray-800 rounded text-xs">84% Complete</span>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 border border-white/10 rounded">
                  <p className="text-sm italic text-gray-400 font-serif leading-relaxed">
                    "Based on the cross-analysis, the bottleneck in autonomous agent reasoning is not the parameter count, but the quality of long-context retrieval..."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-900 border border-gray-800 rounded p-4 flex flex-col justify-end space-y-2">
                    <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                    <div className="w-3/4 h-1.5 bg-gray-800 rounded"></div>
                    <div className="w-1/2 h-1.5 bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-32 bg-gray-900 border border-gray-800 rounded p-4 flex flex-col justify-end space-y-2">
                    <div className="w-full h-1.5 bg-gray-800 rounded"></div>
                    <div className="w-5/6 h-1.5 bg-gray-800 rounded"></div>
                    <div className="w-2/3 h-1.5 bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="p-10 border-t border-gray-900 text-center text-sm text-gray-600">
        &copy; 2026 OmniSearch AI Lab. Built with Next.js & Xiaomi MiMo.
      </footer>
    </div>
  );
}
