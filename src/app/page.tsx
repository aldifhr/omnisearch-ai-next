"use client";
import React, { useState } from 'react';

export default function OmniSearchDashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#ff3333] rounded-sm"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">Omni<span className="text-[#ff3333]">Search</span></span>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-sm hover:bg-gray-200 transition">Launch App</button>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase bg-gray-900 border border-gray-800 rounded-full mb-6">
          Next.js Enterprise Edition | Powered by MiMo V2.5
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-4xl leading-tight">
          Synthesize <span className="text-[#ff3333]">Massive</span> Data <br /> in Seconds.
        </h1>
        <p className="text-gray-400 max-w-2xl text-base mb-10 leading-relaxed">
          The world's first multi-agent autonomous research engine designed for long-context multimodal analysis.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-2xl">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter research URL or upload PDF..." 
            className="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-[#ff3333] transition"
          />
          <button 
            onClick={startAnalysis}
            className="px-8 py-4 bg-[#ff3333] text-white font-bold rounded-sm hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-white/5 border border-[#ff3333]/20 rounded-lg max-w-2xl text-left">
            <h3 className="text-[#ff3333] font-bold text-sm uppercase mb-2">Synthesis Result</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result}</p>
          </div>
        )}
      </main>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-black border border-white/5 rounded-lg overflow-hidden shadow-2xl">
          <div className="p-3 bg-[#111] flex items-center space-x-2 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            <span className="text-[10px] text-gray-600 ml-4">omnisearch.ai / analysis / project-hermes-synthesis</span>
          </div>
          <div className="grid grid-cols-12 h-[350px]">
            <aside className="col-span-3 border-r border-white/5 p-6 flex flex-col space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-4">Active Agents</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Synthesis Manager</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Data Harvester</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <div className="p-4 bg-red-950/10 border border-red-900/20 rounded">
                  <p className="text-[9px] text-red-400 uppercase font-bold mb-1">Token Usage</p>
                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#ff3333] h-full w-[85%]"></div>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-2 italic">Critical: Upgrade to MiMo 100T Plan</p>
                </div>
              </div>
            </aside>
            <div className="col-span-9 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">Research Synthesis</h2>
                  <p className="text-xs text-gray-500">Scanning 1,240 documents (14.2M tokens indexed)</p>
                </div>
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px]">84% Complete</span>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm italic text-gray-400 font-serif leading-relaxed">
                  "Current MiMo-V2 constraints limit the recursive depth to 4-layers..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
