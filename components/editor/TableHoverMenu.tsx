import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { 
  ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Trash2, Trash, Grid2X2, Heading, SplitSquareHorizontal, Plus
} from 'lucide-react';

export const TableBubbleMenu = ({ editor }: { editor: Editor }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  if (!editor) return null;

  // Helper to find the active table DOM element
  const getTableNode = () => {
    if (typeof window === 'undefined') return null;
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return null;
    let node: Node | null = domSelection.anchorNode;
    while (node && node.nodeName !== 'TABLE' && node.nodeName !== 'BODY') {
      node = node.parentNode;
    }
    return node && node.nodeName === 'TABLE' ? (node as HTMLElement) : null;
  };

  // Anchors the menu exactly to the boundaries of the Table, NOT the selected text
  const getTableBoundingRect = () => {
    const table = getTableNode();
    if (table) {
      return table.getBoundingClientRect();
    }
    // Fallback to standard selection
    const domSelection = window.getSelection();
    return domSelection?.getRangeAt(0).getBoundingClientRect() || new DOMRect();
  };

  return (
    <>
      {/* 1. The Options Dropdown (Top Right of Table) */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{ 
          duration: 100, 
          placement: 'top-end',
          getReferenceClientRect: getTableBoundingRect,
          onHidden: () => setIsOptionsOpen(false) 
        }}
        className="relative mb-2"
      >
        <button
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-md shadow-xl text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
        >
          Options <ChevronDown className="w-4 h-4" />
        </button>

        {isOptionsOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-[#18181b] border border-white/10 rounded-lg shadow-2xl py-1 z-50 flex flex-col">
            <DropdownItem icon={<ArrowUp />} label="Insert row above" onClick={() => { editor.chain().focus().addRowBefore().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<ArrowDown />} label="Insert row below" onClick={() => { editor.chain().focus().addRowAfter().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<ArrowLeft />} label="Insert column left" onClick={() => { editor.chain().focus().addColumnBefore().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<ArrowRight />} label="Insert column right" onClick={() => { editor.chain().focus().addColumnAfter().run(); setIsOptionsOpen(false); }} />
            
            <div className="h-px bg-white/10 my-1 w-full" />
            
            <DropdownItem icon={<Trash2 />} label="Delete row" onClick={() => { editor.chain().focus().deleteRow().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<Trash2 />} label="Delete column" onClick={() => { editor.chain().focus().deleteColumn().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<Trash />} label="Delete table" onClick={() => { editor.chain().focus().deleteTable().run(); setIsOptionsOpen(false); }} />
            
            <div className="h-px bg-white/10 my-1 w-full" />
            
            <DropdownItem icon={<Heading />} label="Toggle header row" onClick={() => { editor.chain().focus().toggleHeaderRow().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<SplitSquareHorizontal />} label="Split cell" onClick={() => { editor.chain().focus().splitCell().run(); setIsOptionsOpen(false); }} />
            <DropdownItem icon={<Grid2X2 />} label="Merge cells" onClick={() => { editor.chain().focus().mergeCells().run(); setIsOptionsOpen(false); }} />
          </div>
        )}
      </BubbleMenu>

      {/* 2. The Right Edge + Column Button */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{ 
          duration: 100, 
          placement: 'right',
          getReferenceClientRect: getTableBoundingRect
        }}
      >
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="flex items-center justify-center w-6 h-6 bg-[#18181b] border border-white/10 rounded-md shadow-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors ml-1"
          title="Add Column Right"
        >
          <Plus className="w-4 h-4" />
        </button>
      </BubbleMenu>

      {/* 3. The Bottom Edge + Row Button */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{ 
          duration: 100, 
          placement: 'bottom',
          getReferenceClientRect: getTableBoundingRect
        }}
      >
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="flex items-center justify-center w-6 h-6 bg-[#18181b] border border-white/10 rounded-md shadow-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors mt-1"
          title="Add Row Below"
        >
          <Plus className="w-4 h-4" />
        </button>
      </BubbleMenu>
    </>
  );
};

const DropdownItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left"
  >
    <div className="opacity-70">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
    </div>
    {label}
  </button>
);
