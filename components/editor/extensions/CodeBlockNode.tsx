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
    <NodeViewWrapper className="relative group my-8">
      {/* Floating Toolbar (Visible on Hover) */}
      <div 
        className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" 
        contentEditable={false}
      >
        <select 
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-md px-2 py-1 text-xs text-zinc-400 outline-none cursor-pointer hover:text-zinc-200 transition-colors"
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
          className="p-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      
      {/* Code Content matching exactly the user's reference HTML (styles inherited from globals.css) */}
      <pre className="!m-0">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
