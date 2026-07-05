"use client";

import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, FileText
} from 'lucide-react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashCommand } from './slash-extension';
import { Callout } from './extensions/CalloutNode';
import { CustomCodeBlock } from './extensions/CodeBlockNode';
import { ResizableImage } from './extensions/ResizableImageNode';
import { PdfBlock } from './extensions/PdfBlockNode';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({ content = '', onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      PdfBlock,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-400 underline decoration-emerald-500/30 hover:decoration-emerald-500 transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder: 'Press "/" for commands...',
      }),
      Callout,
      CustomCodeBlock,
      SlashCommand,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Tailwind Typography classes adjusted for our dark theme
        class: 'prose prose-invert prose-emerald max-w-none focus:outline-none min-h-[400px]',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';

          if (isImage || isPdf) {
            event.preventDefault();
            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (!coordinates) return false;
            
            // 1. Insert block with isUploading = true
            const nodeType = isImage ? schema.nodes.resizableImage : schema.nodes.pdfBlock;
            const initialAttrs = isImage 
              ? { isUploading: true } 
              : { isUploading: true, filename: file.name };
              
            const node = nodeType.create(initialAttrs);
            const transaction = view.state.tr.insert(coordinates.pos, node);
            view.dispatch(transaction);
            
            // 2. Simulate network delay then swap to real uploaded file
            setTimeout(() => {
              const objectUrl = URL.createObjectURL(file);
              view.dispatch(view.state.tr.setNodeMarkup(coordinates.pos, undefined, { 
                src: objectUrl, 
                isUploading: false,
                ...(isPdf ? { filename: file.name } : {})
              }));
            }, 2000);
            
            return true;
          }
        }
        return false;
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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        editor.chain().focus().insertContent({
          type: 'resizableImage',
          attrs: { isUploading: true }
        }).run();
        
        setTimeout(() => {
          const objectUrl = URL.createObjectURL(file);
          editor.commands.command(({ tr }) => {
            tr.doc.descendants((node, pos) => {
              if (node.type.name === 'resizableImage' && node.attrs.isUploading === true) {
                tr.setNodeMarkup(pos, undefined, { src: objectUrl, isUploading: false });
              }
            });
            return true;
          });
        }, 2000);
      }
    };
    input.click();
  };

  const addPdf = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        editor.chain().focus().insertContent({
          type: 'pdfBlock',
          attrs: { isUploading: true, filename: file.name }
        }).run();
        
        setTimeout(() => {
          const objectUrl = URL.createObjectURL(file);
          editor.commands.command(({ tr }) => {
            tr.doc.descendants((node, pos) => {
              if (node.type.name === 'pdfBlock' && node.attrs.isUploading === true) {
                tr.setNodeMarkup(pos, undefined, { src: objectUrl, isUploading: false, filename: file.name });
              }
            });
            return true;
          });
        }, 2000);
      }
    };
    input.click();
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
          <ToolbarButton onClick={addPdf}><FileText className="w-4 h-4" /></ToolbarButton>
        </div>
      </div>

      {/* Bubble Menu for context-aware formatting */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 p-1 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl">
          <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')}><Bold className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')}><Italic className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')}><Strikethrough className="w-4 h-4" /></ToolbarButton>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}><LinkIcon className="w-4 h-4" /></ToolbarButton>
        </BubbleMenu>
      )}

      {/* Editor Content Canvas */}
      <div className="p-6 cursor-text min-h-[500px]" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
