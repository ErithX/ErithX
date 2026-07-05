import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { FileText, Download, Loader2 } from 'lucide-react';

export const PdfBlock = Node.create({
  name: 'pdfBlock',
  group: 'block',
  atom: true, // It doesn't have editable content inside it

  addAttributes() {
    return {
      src: { default: null },
      filename: { default: 'document.pdf' },
      isUploading: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pdf-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pdf-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfBlockComponent);
  },
});

const PdfBlockComponent = ({ node, selected }: any) => {
  const { src, filename, isUploading } = node.attrs;

  return (
    <NodeViewWrapper className={`my-6 select-none`}>
      <div className={`flex items-center justify-between p-4 rounded-xl border bg-[#18181b]/80 backdrop-blur-md transition-all ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10 hover:bg-[#18181b]'
      }`}>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-100">{filename}</div>
            <div className="text-xs text-zinc-500">
              {isUploading ? 'Uploading securely...' : 'PDF Document'}
            </div>
          </div>
        </div>

        {!isUploading && src && (
          <a 
            href={src} 
            download={filename}
            target="_blank"
            rel="noopener noreferrer"
            onMouseDown={(e) => e.stopPropagation()} // Prevent Tiptap from stealing focus when clicking download
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors text-emerald-400"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        )}
      </div>
    </NodeViewWrapper>
  );
};
