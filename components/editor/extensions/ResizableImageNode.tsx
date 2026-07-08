import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, ImageIcon } from 'lucide-react';

export const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  content: 'inline*',
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      align: { default: 'center' },
      width: { default: '100%' },
      isUploading: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="resizable-image"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': 'resizable-image' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

const ResizableImageComponent = ({ editor, node, updateAttributes, selected }: any) => {
  const { src, align, width, isUploading } = node.attrs;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isEditable = editor.isEditable;

  let alignClass = 'mx-auto';
  if (align === 'left') alignClass = 'mr-auto ml-0';
  if (align === 'right') alignClass = 'ml-auto mr-0';

  const handleMouseUp = () => {
    if (isEditable && containerRef.current) {
      const pxWidth = containerRef.current.getBoundingClientRect().width;
      updateAttributes({ width: pxWidth });
    }
  };

  return (
    <NodeViewWrapper className={`relative my-8 flex flex-col group ${alignClass} w-fit max-w-full`}>
      {/* Image Container with native CSS resize */}
      <div 
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className={`relative inline-block rounded-xl overflow-hidden border ${isEditable && selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10'} transition-all`}
        style={{ 
          resize: isEditable ? 'horizontal' : 'none', 
          overflow: 'hidden', 
          minWidth: '200px', 
          maxWidth: '100%',
          width: typeof width === 'number' ? `${width}px` : width 
        }}
      >
        {isUploading ? (
          // Beautiful Blurhash / Skeleton Loader
          <div className="w-full aspect-video bg-zinc-800 animate-pulse flex flex-col items-center justify-center text-zinc-500">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">Uploading image...</span>
          </div>
        ) : (
          <img src={src} alt="Uploaded" className="w-full h-auto block pointer-events-none" />
        )}

        {/* Hover Alignment Toolbar */}
        {isEditable && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
            <button 
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={() => updateAttributes({ align: 'left' })} 
              className={`p-1.5 rounded-md hover:bg-white/10 ${align === 'left' ? 'text-emerald-400' : 'text-white'}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={() => updateAttributes({ align: 'center' })} 
              className={`p-1.5 rounded-md hover:bg-white/10 ${align === 'center' ? 'text-emerald-400' : 'text-white'}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={() => updateAttributes({ align: 'right' })} 
              className={`p-1.5 rounded-md hover:bg-white/10 ${align === 'right' ? 'text-emerald-400' : 'text-white'}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Caption Content Area */}
      <figcaption className="mt-2 text-center text-sm text-zinc-500 font-medium w-full">
        <NodeViewContent className="outline-none empty:before:content-['Write_a_caption...'] empty:before:text-zinc-600 empty:before:pointer-events-none" />
      </figcaption>
    </NodeViewWrapper>
  );
};
