"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { SlashCommand } from './slash-extension';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({ content = '', onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto shadow-md border border-white/10 my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-400 underline decoration-emerald-500/30 hover:decoration-emerald-500 transition-colors',
        },
      }),
      SlashCommand,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Tailwind Typography classes adjusted for our dark theme
        class: 'prose prose-invert prose-emerald max-w-none focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const addImage = () => {
    const url = window.prompt('URL of the image (or type /media later):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, isActive = false, disabled = false, children 
  }: { 
    onClick: () => void, isActive?: boolean, disabled?: boolean, children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
        isActive 
          ? 'bg-emerald-500/20 text-emerald-400' 
          : 'text-zinc-400 hover:bg-white/10 hover:text-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md flex flex-col">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <ToolbarButton onClick={undo} disabled={!editor.can().undo()}><Undo className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={redo} disabled={!editor.can().redo()}><Redo className="w-4 h-4" /></ToolbarButton>
        </div>
        
        <div className="flex items-center gap-1 px-2 border-r border-white/10">
          <ToolbarButton onClick={toggleH1} isActive={editor.isActive('heading', { level: 1 })}><Heading1 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleH2} isActive={editor.isActive('heading', { level: 2 })}><Heading2 className="w-4 h-4" /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-white/10">
          <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')}><Bold className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')}><Italic className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')}><Strikethrough className="w-4 h-4" /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-white/10">
          <ToolbarButton onClick={toggleBulletList} isActive={editor.isActive('bulletList')}><List className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleOrderedList} isActive={editor.isActive('orderedList')}><ListOrdered className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleBlockquote} isActive={editor.isActive('blockquote')}><Quote className="w-4 h-4" /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2">
          <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}><LinkIcon className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={addImage}><ImageIcon className="w-4 h-4" /></ToolbarButton>
        </div>
      </div>

      {/* Editor Content Canvas */}
      <div className="p-6 cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
