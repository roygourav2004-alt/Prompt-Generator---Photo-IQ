import React, { useState } from 'react';
import { UploadedFile, AppState } from './types';
import { generateDesignPrompt } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import TextInput from './components/TextInput';
import ResultDisplay from './components/ResultDisplay';
import { Wand2, LayoutTemplate } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);

  const handleGenerate = async () => {
    if (!file || !textContent.trim()) return;

    setAppState(AppState.ANALYZING);
    try {
      const result = await generateDesignPrompt(file.base64, textContent);
      setGeneratedPrompt(result.prompt);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const isReady = file !== null && textContent.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              StyleFuse <span className="text-xs font-normal text-slate-500 ml-1 border border-slate-700 px-1.5 py-0.5 rounded">v1.0</span>
            </h1>
          </div>
          <div className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
             Powered by Gemini 2.0 Reasoning
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Intro */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Design from <span className="text-indigo-400">Reference</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Upload a style reference, add your content, and let AI reverse-engineer the perfect prompt to recreate that exact aesthetic.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 h-auto md:h-[350px]">
          {/* Left: Image Upload */}
          <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="bg-[#161f32] h-full rounded-xl p-6">
                <ImageUploader uploadedFile={file} onUpload={setFile} />
             </div>
          </div>

          {/* Right: Text Input */}
          <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="bg-[#161f32] h-full rounded-xl p-6">
                <TextInput value={textContent} onChange={setTextContent} />
             </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleGenerate}
            disabled={!isReady || appState === AppState.ANALYZING}
            className={`
              group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300
              ${isReady 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 translate-y-0' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed translate-y-0'}
              ${appState === AppState.ANALYZING ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {appState === AppState.ANALYZING ? (
               <>Generating...</>
            ) : (
               <>
                 <Wand2 className={`w-5 h-5 ${isReady ? 'group-hover:rotate-12 transition-transform' : ''}`} />
                 Generate Prompt
               </>
            )}
            
            {/* Glow effect */}
            {isReady && (
              <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
            )}
          </button>
        </div>

        {/* Output Section */}
        {(appState !== AppState.IDLE) && (
          <div className="animate-fade-in-up">
            <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[300px]">
               <div className="bg-[#161f32] h-full min-h-[300px] rounded-xl p-6">
                 <ResultDisplay state={appState} prompt={generatedPrompt} />
               </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 text-center text-slate-600 text-sm">
        <p>Use the generated prompt in your favorite image generation tool.</p>
      </footer>
    </div>
  );
};

export default App;