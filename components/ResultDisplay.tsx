import React, { useState } from 'react';
import { Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { AppState } from '../types';

interface ResultDisplayProps {
  state: AppState;
  prompt: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ state, prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (state === AppState.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-slate-800 rounded-xl bg-slate-900/50">
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p>Ready to generate. Upload an image and add text to start.</p>
      </div>
    );
  }

  if (state === AppState.ANALYZING) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border border-slate-800 rounded-xl bg-slate-900/50">
        <Loader2 className="w-12 h-12 mb-4 text-indigo-500 animate-spin" />
        <h3 className="text-lg font-semibold text-slate-200">Analyzing Layout...</h3>
        <p className="text-slate-500 text-sm mt-2 text-center max-w-xs">
          Gemini is reasoning about the visual style and composing your prompt. This may take a moment.
        </p>
      </div>
    );
  }

  if (state === AppState.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-red-400 p-8 border border-red-900/30 rounded-xl bg-red-900/10">
        <p>Something went wrong during generation. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Generated Prompt
        </h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${copied 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'}
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {prompt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;