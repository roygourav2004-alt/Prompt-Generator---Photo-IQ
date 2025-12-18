import React from 'react';
import { Type } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
        <Type className="w-5 h-5 text-indigo-400" />
        Content Text
      </h2>
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter the text content you want to appear in the design. E.g., 'Summer Sale 50% Off' or 'Tech Conference 2025'..."
          className="w-full h-full min-h-[160px] bg-slate-800/20 border-2 border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800/50 resize-none transition-all duration-200"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-600">
          {value.length} characters
        </div>
      </div>
    </div>
  );
};

export default TextInput;