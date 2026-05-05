'use client';

import { useState, useEffect } from 'react';

const HISTORY_KEY = 'omnisearch_history';

type HistoryItem = {
  id: string;
  query: string;
  content: string;
  timestamp: string;
  latency: string;
  tokens: number;
  dataType: string;
};

export default function OmniSearchDashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    content: string;
    snippets: string[];
    citations: string[];
    metadata: any;
  } | null>(null);
  const [logs, setLogs] = useState<{status: string, msg: string}[]>([]);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 99.9 ? prev + 0.01 : 99.99));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveToHistory = (q: string, data: any, latency: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      query: q,
      content: data.content,
      timestamp: new Date().toISOString(),
      latency,
      tokens: data.metadata?.tokenUsage?.total || 0,
      dataType: data.metadata?.dataType || 'TEXT',
    };
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 20);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const steps = [
    "Starting up...",
    "Fetching source...",
    "Reading document...",
    "Understanding context...",
    "Thinking deeply...",
    "Writing summary..."
  ];

  const startAnalysis = async (customQuery?: string) => {
    const targetQuery = customQuery || query;
    if (!targetQuery) return;
    setLoading(true);
    setResult(null);
    setStep(0);
    setLogs([]);

    for (let i = 0; i < steps.length - 1; i++) {
      setStep(i);
      setLogs(prev => [...prev, { status: '•', msg: steps[i] }]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const startTime = performance.now();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      const elapsedMs = Math.round(performance.now() - startTime);
      const finalLatency = `${elapsedMs}ms`;

      setStep(steps.length - 1);
      setResult({
        content: data.content,
        snippets: data.snippets || [],
        citations: data.citations || [],
        metadata: { ...data.metadata, latency: finalLatency }
      });
      saveToHistory(targetQuery, data, finalLatency);
      setLoading(false);
      setLogs(prev => [...prev, { status: '✓', msg: `Done in ${elapsedMs}ms · ${data.metadata?.tokenUsage?.total?.toLocaleString() || '?'} tokens used` }]);
    } catch (error) {
      setLoading(false);
      setLogs(prev => [...prev, { status: '✗', msg: 'Something went wrong. Please try again.' }]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 selection:text-white pb-20">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-8">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => { setResult(null); setLogs([]); setQuery(''); }}>
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">OmniSearch <span className="text-red-600 non-italic">AI</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
          <span className="text-red-500/50 animate-pulse">● Live</span>
          <button
            onClick={() => setShowHistory(h => !h)}
            className="relative flex items-center space-x-2 hover:text-white transition"
          >
            <span>History</span>
            {history.length > 0 && (
              <span className="absolute -top-2 -right-5 bg-red-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{history.length}</span>
            )}
          </button>
          <span className="px-4 py-2 bg-white/5 rounded-full border border-white/5 text-white">v4.2</span>
        </div>
      </nav>

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-grow bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <aside className="w-full max-w-md bg-black border-l border-white/10 flex flex-col h-full overflow-hidden animate-in slide-in-from-right-8 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter">History</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{history.length} saved analyses</p>
              </div>
              <div className="flex items-center space-x-4">
                {history.length > 0 && (
                  <button
                    onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }}
                    className="text-[9px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest transition"
                  >Clear all</button>
                )}
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-700 italic text-sm">No history yet.</div>
              ) : (
                history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setQuery(item.query); setShowHistory(false); startAnalysis(item.query); }}
                    className="w-full p-6 glass rounded-2xl border-white/5 hover:border-red-500/30 text-left transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        item.dataType === 'PDF_DOCUMENT' ? 'bg-red-600/20 text-red-400' : 'bg-white/5 text-gray-400'
                      }`}>{item.dataType === 'PDF_DOCUMENT' ? 'PDF' : 'Text'}</span>
                      <span className="text-[9px] text-gray-600">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-300 group-hover:text-white transition truncate mb-3">{item.query}</p>
                    <p className="text-[11px] text-gray-600 line-clamp-2 italic mb-4">"{item.content.substring(0, 100)}..."</p>
                    <div className="flex space-x-4 text-[9px] font-black text-gray-600 uppercase">
                      <span>{item.latency}</span>
                      <span>{item.tokens.toLocaleString()} tokens</span>
                      <span className="ml-auto text-red-500 group-hover:translate-x-1 transition-transform">Run again →</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Hero */}
      <header className="relative z-10 pt-16 pb-12 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-3 px-5 py-2 glass-red rounded-full mb-12">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500">AI Research Assistant</span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black mb-10 max-w-6xl leading-[0.85] tracking-tighter italic">
          UNDERSTAND <span className="text-red-600">ANY</span><br />
          <span className="text-gray-400/30">DOCUMENT.</span>
        </h1>

        <p className="text-gray-500 max-w-xl text-lg mb-14 leading-relaxed font-medium">
          Paste a PDF link or ask anything. Get a deep, accurate summary powered by advanced AI reasoning.
        </p>

        {/* Search Box */}
        <div className="relative w-full max-w-4xl group px-4">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative p-2 glass rounded-2xl flex flex-col md:flex-row items-center border-white/10 group-hover:border-red-500/30 transition-all duration-500">
            <div className="flex-grow flex items-center px-6 py-4 w-full">
              <svg className="w-5 h-5 text-gray-600 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                placeholder="Paste a PDF link or type your question..."
                className="bg-transparent w-full text-xl focus:outline-none placeholder:text-gray-800 font-medium"
              />
            </div>
            <button
              onClick={() => startAnalysis()}
              disabled={loading || !query}
              className="w-full md:w-auto px-12 py-5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl transition-all shadow-2xl shadow-red-600/20 active:scale-95"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Step progress */}
        {loading && (
          <div className="mt-10 flex items-center space-x-3 text-sm text-gray-500 animate-pulse">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span>{steps[step]}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">

        {/* Left: Activity Log + Graph */}
        <div className="lg:col-span-4 space-y-8">
          {/* Processing Graph */}
          <div className="glass rounded-[2rem] p-8 border-white/5 relative overflow-hidden h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Processing Graph</h4>
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-red-600 animate-ping' : result ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            </div>

            <div className="flex-grow relative flex items-center justify-center">
              <svg className="w-full h-full opacity-30">
                <circle cx="50%" cy="50%" r="60" className="stroke-red-600 fill-none stroke-[0.5] animate-pulse" />
                <circle cx="50%" cy="50%" r="100" className="stroke-red-600/20 fill-none stroke-[0.5] dashed-circle" />
                {loading && [1,2,3,4,5].map(i => (
                  <circle key={i} r="3" className="fill-red-600 animate-bounce" style={{
                    cx: `${25 + (i * 12)}%`,
                    cy: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.15}s`
                  }} />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-black px-3 py-1 rounded-full border border-red-500/20">
                  {loading ? steps[step] : result ? 'Complete' : 'Idle'}
                </p>
              </div>
            </div>

            {result && (
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Time</p>
                  <p className="text-sm font-black">{result.metadata.latency}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Model</p>
                  <p className="text-sm font-black text-red-500 truncate">{result.metadata.model?.split('/').pop()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="glass rounded-[2rem] p-8 border-white/5 flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Activity</h4>
              {logs.length > 0 && (
                <button onClick={() => setLogs([])} className="text-[9px] text-gray-700 hover:text-gray-400 uppercase">Clear</button>
              )}
            </div>
            <div className="flex-grow overflow-y-auto font-mono text-[12px] space-y-2 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-700 italic text-sm">No activity yet.</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex space-x-3 pb-2 border-b border-white/5 last:border-0">
                    <span className={log.status === '✓' ? 'text-green-500' : log.status === '✗' ? 'text-red-500' : 'text-gray-600'}>{log.status}</span>
                    <span className="text-gray-400">{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              {/* Summary */}
              <div className="p-10 glass-red rounded-[2.5rem] border border-red-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                    <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.4em]">Summary</h3>
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    {result.metadata.tokenUsage?.total?.toLocaleString() || '—'} tokens · {result.metadata.latency}
                  </span>
                </div>
                <p className="text-gray-100 text-2xl md:text-3xl leading-snug font-serif italic mb-10">
                  "{result.content}"
                </p>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Response Time</p>
                    <p className="text-lg font-black">{result.metadata.latency}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Tokens Used</p>
                    <p className="text-lg font-black">{result.metadata.tokenUsage?.total?.toLocaleString() || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Cost</p>
                    <p className="text-lg font-black text-red-500">{result.metadata.tokenUsage?.cost || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Key Quotes + Related Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Key Quotes */}
                <div className="glass rounded-[2rem] p-8 border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Key Quotes</h4>
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                  </div>
                  {result.snippets.length > 0 ? result.snippets.map((s, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border-l-2 border-red-600 text-[12px] text-gray-400 italic leading-relaxed">
                      "{s}"
                    </div>
                  )) : (
                    <p className="text-gray-700 text-sm italic">No direct quotes extracted.</p>
                  )}
                </div>

                {/* Related Topics */}
                <div className="glass rounded-[2rem] p-8 border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Explore Further</h4>
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </div>
                  {result.citations.length > 0 ? result.citations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { setQuery(c); startAnalysis(c); }}
                      className="w-full p-4 bg-white/5 hover:bg-red-600/10 border border-white/5 hover:border-red-600/30 rounded-xl transition-all text-left flex justify-between items-center group"
                    >
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white transition truncate max-w-[80%]">{c}</span>
                      <span className="text-[9px] font-black text-red-500 group-hover:translate-x-1 transition-transform">Search →</span>
                    </button>
                  )) : (
                    <p className="text-gray-700 text-sm italic">No related topics found.</p>
                  )}
                  <p className="text-[9px] text-gray-700 text-center uppercase tracking-widest pt-2">Click to analyze related topics</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-20 glass rounded-[3rem] border-2 border-dashed border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Ready to Analyze</h2>
              <p className="text-gray-600 max-w-sm mb-10">Paste a PDF link or type a question above. The AI will read, understand, and summarize it for you.</p>
              <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  {
                    label: '📄 Research Paper',
                    desc: 'Summarize a paper on large language models',
                    query: 'https://arxiv.org/pdf/2302.13971',
                  },
                  {
                    label: '🤔 Quick Question',
                    desc: 'What is the difference between GPT and BERT?',
                    query: 'What is the difference between GPT and BERT?',
                  },
                  {
                    label: '📄 AI Safety Paper',
                    desc: 'Read the Attention Is All You Need paper',
                    query: 'https://arxiv.org/pdf/1706.03762',
                  },
                  {
                    label: '🤔 Quick Question',
                    desc: 'Explain how transformers work in simple terms',
                    query: 'Explain how transformers work in simple terms',
                  },
                ].map((ex) => (
                  <button
                    key={ex.query}
                    onClick={() => { setQuery(ex.query); startAnalysis(ex.query); }}
                    className="p-5 glass rounded-2xl border-white/5 hover:border-red-500/30 text-left transition-all group"
                  >
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{ex.label}</p>
                    <p className="text-sm text-gray-300 group-hover:text-white transition leading-snug">{ex.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-red { background: rgba(220,38,38,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(220,38,38,0.08); }
        .dashed-circle { stroke-dasharray: 4 4; animation: rotate 30s linear infinite; transform-origin: center; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
