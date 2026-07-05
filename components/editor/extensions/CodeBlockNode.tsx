import React, { useState } from 'react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { common, createLowlight } from 'lowlight';
import { Check, Copy } from 'lucide-react';

const lowlight = createLowlight(common);

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
}).configure({ lowlight });

const CodeBlockComponent = ({ node, updateAttributes, extension }: any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block my-6 rounded-xl border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden group">
      {/* Mac-like Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        
        <div 
          className="flex items-center gap-2" 
          contentEditable={false}
        >
          <select 
            className="bg-transparent text-xs text-zinc-400 outline-none cursor-pointer hover:text-zinc-200 transition-colors"
            value={node.attrs.language || 'auto'}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onChange={(e) => {
              updateAttributes({ language: e.target.value });
            }}
          >
            <option value="auto" className="bg-[#18181b] text-zinc-300">Auto</option>
            <option value="javascript" className="bg-[#18181b] text-zinc-300">JavaScript</option>
            <option value="typescript" className="bg-[#18181b] text-zinc-300">TypeScript</option>
            <option value="cpp" className="bg-[#18181b] text-zinc-300">C++</option>
            <option value="python" className="bg-[#18181b] text-zinc-300">Python</option>
            <option value="java" className="bg-[#18181b] text-zinc-300">Java</option>
          </select>

          <button 
            contentEditable={false}
            onClick={copyToClipboard}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      {/* Code Content */}
      <pre className="p-4 text-sm font-mono overflow-x-auto text-zinc-300 scrollbar-thin">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
