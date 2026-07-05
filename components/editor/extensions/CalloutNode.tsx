import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Info } from 'lucide-react';

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  
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

const CalloutComponent = (props: any) => {
  return (
    <NodeViewWrapper className="relative flex items-start gap-4 p-4 my-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
      <div className="flex-shrink-0 mt-0.5 text-emerald-400">
        <Info className="w-5 h-5" />
      </div>
      <NodeViewContent className="flex-1 min-w-0 text-emerald-50 font-medium leading-relaxed outline-none" />
    </NodeViewWrapper>
  );
};
