import React, { useState } from 'react';
import { AdResult } from '../types';

interface AdResultCardProps {
  result: AdResult;
  variantLabel: string;
}

const AdResultCard: React.FC<AdResultCardProps> = ({ result, variantLabel }) => {
  const [copied, setCopied] = useState(false);

  const fullText = `${result.headline}\n\n${result.body}\n\n${result.ctaLine}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full transform transition-all hover:border-brand-300 dark:hover:border-brand-700 group">
      {/* Card Header */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30 px-2 py-1 rounded-md uppercase tracking-wide">
          {variantLabel}
        </span>
        <div className="flex gap-2">
           <span className="text-xs text-slate-400 font-mono">
             {fullText.length} chars
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">
            {result.headline}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
            {result.body}
          </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <span className="opacity-70 text-xs uppercase text-slate-500 mr-1">CTA:</span>
            {result.ctaLine}
          </p>
          {result.explanation && (
             <p className="text-xs text-slate-400 italic mt-2">
               AI Note: {result.explanation}
             </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
            ${copied 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Text
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdResultCard;
