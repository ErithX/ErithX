import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  
  addAttributes() {
    return {
      intent: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-intent') || 'info',
        renderHTML: attributes => ({
          'data-intent': attributes.intent,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },
});

const CalloutComponent = ({ node, updateAttributes }: any) => {
  const { intent } = node.attrs;

  const intents = {
    info: {
      emoji: '💡',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-50',
    },
    success: {
      emoji: '✅',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-50',
    },
    warning: {
      emoji: '⚠️',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-50',
    },
    danger: {
      emoji: '🛑',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-50',
    },
  };

  const current = intents[intent as keyof typeof intents] || intents.info;

  return (
    <NodeViewWrapper className={`relative flex items-start gap-4 p-4 my-6 rounded-xl border backdrop-blur-md group transition-colors ${current.bg} ${current.border}`}>
      
      {/* Floating Toolbar (appears on hover) */}
      <div 
        contentEditable={false}
        className="absolute -top-3 -right-3 flex items-center gap-1 bg-zinc-900 border border-white/10 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10"
      >
        {(Object.keys(intents) as Array<keyof typeof intents>).map((key) => (
          <button
            key={key}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={(e) => { e.preventDefault(); updateAttributes({ intent: key }); }}
            className={`w-7 h-7 flex items-center justify-center rounded text-sm hover:bg-white/10 transition-colors ${intent === key ? 'bg-white/10 ring-1 ring-white/20' : ''}`}
            title={key}
          >
            {intents[key].emoji}
          </button>
        ))}
      </div>

      <div className="flex-shrink-0 mt-0.5 text-xl select-none">
        {current.emoji}
      </div>
      <NodeViewContent className={`flex-1 min-w-0 font-medium leading-relaxed outline-none ${current.text}`} />
    </NodeViewWrapper>
  );
};
