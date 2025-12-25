import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AdForm from './components/AdForm';
import AdResultCard from './components/AdResultCard';
import { AdFormData, AdResult, Platform, Tone, CallToAction } from './types';
import { generateAdCopy } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'adcraft_history_v1';

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Form State
  const initialFormState: AdFormData = {
    productName: '',
    industry: '',
    targetAudience: '',
    platform: Platform.Instagram,
    tone: Tone.Friendly,
    cta: CallToAction.ShopNow,
    includeEmojis: true
  };

  const [formData, setFormData] = useState<AdFormData>(initialFormState);
  
  // Results State
  const [results, setResults] = useState<AdResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<AdResult[][]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]); // Clear previous specific results, but keep history

    try {
      const generatedAds = await generateAdCopy(formData);
      setResults(generatedAds);
      // Add to history (limit to last 10 sets)
      setHistory(prev => [generatedAds, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setResults([]);
    setError(null);
  };

  const restoreFromHistory = (resultGroup: AdResult[]) => {
    setResults(resultGroup);
    if (resultGroup.length > 0) {
        setFormData(resultGroup[0].metadata);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col">
      <Header isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Intro Section */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">Viral Ad Copy</span> in Seconds
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Leverage AI to generate persuasive marketing campaigns tailored to your audience and platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 z-10">
            <AdForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate} 
              isLoading={isLoading}
              onClear={handleClear}
            />

            {/* Recent History Sidebar (Visible on Desktop) */}
            {history.length > 0 && (
              <div className="mt-8 hidden lg:block">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Recent Generations</h3>
                <div className="space-y-3">
                  {history.map((group, idx) => (
                    <button
                      key={group[0].id} // Use first item's ID
                      onClick={() => restoreFromHistory(group)}
                      className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all text-sm group"
                    >
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {group[0].metadata.productName}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-500">{group[0].metadata.platform}</span>
                        <span className="text-xs text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">Load &rarr;</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 xl:col-span-9">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && results.length === 0 && !error && (
               <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-full mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                 </div>
                 <h3 className="text-xl font-medium text-slate-800 dark:text-white">Ready to create?</h3>
                 <p className="text-slate-500 dark:text-slate-400 max-w-md text-center mt-2">
                   Fill out the form on the left to generate professional ad copies tailored to your needs.
                 </p>
               </div>
            )}

            {/* Loading State - Skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 animate-pulse h-64 flex flex-col">
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
                     <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                     <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-8"></div>
                     <div className="mt-auto h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                   </div>
                 ))}
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                     Generated Results for <span className="text-brand-600 dark:text-brand-400">{results[0]?.metadata.productName}</span>
                   </h3>
                   <span className="text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                     {results[0]?.metadata.platform} • {results[0]?.metadata.tone}
                   </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((ad, index) => (
                    <div key={ad.id} className="h-full">
                      <AdResultCard 
                        result={ad} 
                        variantLabel={`Variant ${String.fromCharCode(65 + index)}`} // A, B, C
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile History (Bottom) */}
            {history.length > 0 && (
              <div className="mt-12 lg:hidden border-t border-slate-200 dark:border-slate-800 pt-8">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent History</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {history.slice(0, 4).map((group, idx) => (
                    <button
                      key={`mob-${group[0].id}`}
                      onClick={() => restoreFromHistory(group)}
                      className="text-left p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">{group[0].metadata.productName}</div>
                      <div className="text-xs text-slate-500 mt-1">{group[0].metadata.industry}</div>
                    </button>
                  ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Built with React, Tailwind & Gemini AI. 
        </p>
      </footer>
    </div>
  );
};

export default App;
