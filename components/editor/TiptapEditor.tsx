"use client";

import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, FileText, Trash2
} from 'lucide-react';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashCommand } from './slash-extension';
import { Callout } from './extensions/CalloutNode';
import { CustomCodeBlock } from './extensions/CodeBlockNode';
import { ResizableImage } from './extensions/ResizableImageNode';
import { PdfBlock } from './extensions/PdfBlockNode';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TableBubbleMenu } from './TableBubbleMenu';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
}

export default function TiptapEditor({ content = '', onChange, readOnly = false }: TiptapEditorProps) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      ResizableImage,
      PdfBlock,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'min-w-full border-collapse table-auto w-full my-8 border-t border-white/10',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-white/10 hover:bg-white/[0.02] transition-colors',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border-b-2 border-emerald-500/50 p-3 text-left font-semibold text-zinc-300 bg-black/40',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-3 border-r border-white/5 last:border-r-0 text-zinc-300 align-top',
        },
      }),
      Link.configure({
        openOnClick: readOnly, // Clickable in readOnly mode
        HTMLAttributes: {
          class: 'text-emerald-400 underline decoration-emerald-500/30 hover:decoration-emerald-500 transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder: 'Press "/" for commands...',
      }),
      Callout,
      CustomCodeBlock,
      ...(readOnly ? [] : [SlashCommand]),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Removed aggressive Tailwind Typography (prose) to allow our custom globals.css to perfectly style the editor
        class: readOnly ? 'focus:outline-none' : 'focus:outline-none min-h-[400px]',
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
            
            // 2. Upload file to Supabase Storage via API
            const uploadFile = async () => {
              const formData = new FormData();
              formData.append('file', file);
              try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.url) {
                  const tr = view.state.tr;
                  tr.doc.descendants((node, pos) => {
                    if (node.type.name === nodeType.name && node.attrs.isUploading === true) {
                      tr.setNodeMarkup(pos, undefined, { 
                        ...node.attrs,
                        src: data.url, 
                        isUploading: false,
                        ...(isPdf ? { filename: file.name } : {})
                      });
                    }
                  });
                  view.dispatch(tr);
                }
              } catch (e) {
                console.error("Upload failed", e);
              }
            };
            uploadFile();
            
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        let handled = false;
        for (const item of Array.from(items)) {
          const isImage = item.type.startsWith('image/');
          const isPdf = item.type === 'application/pdf';

          if (isImage || isPdf) {
            const file = item.getAsFile();
            if (!file) continue;

            handled = true;
            event.preventDefault();
            
            const { schema } = view.state;
            
            const nodeType = isImage ? schema.nodes.resizableImage : schema.nodes.pdfBlock;
            const initialAttrs = isImage 
              ? { isUploading: true } 
              : { isUploading: true, filename: file.name };
              
            const node = nodeType.create(initialAttrs);
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
            
            const uploadFile = async () => {
              const formData = new FormData();
              formData.append('file', file);
              try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.url) {
                  const tr = view.state.tr;
                  tr.doc.descendants((node, pos) => {
                    if (node.type.name === nodeType.name && node.attrs.isUploading === true) {
                      tr.setNodeMarkup(pos, undefined, { 
                        ...node.attrs,
                        src: data.url, 
                        isUploading: false,
                        ...(isPdf ? { filename: file.name } : {})
                      });
                    }
                  });
                  view.dispatch(tr);
                }
              } catch (e) {
                console.error("Upload failed", e);
              }
            };
            uploadFile();
            return true;
          }
        }
        return handled;
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        // Defer state update to avoid React flushSync warning during Tiptap render lifecycle
        setTimeout(() => {
          onChange(editor.getHTML());
        }, 0);
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
        
        const uploadFile = async () => {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
              editor.commands.command(({ tr }) => {
                tr.doc.descendants((node, pos) => {
                  if (node.type.name === 'resizableImage' && node.attrs.isUploading === true) {
                    tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: data.url, isUploading: false });
                  }
                });
                return true;
              });
            }
          } catch (e) {
            console.error("Upload failed", e);
          }
        };
        uploadFile();
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
        
        const uploadPdf = async () => {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
              editor.commands.command(({ tr }) => {
                tr.doc.descendants((node, pos) => {
                  if (node.type.name === 'pdfBlock' && node.attrs.isUploading === true) {
                    tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: data.url, isUploading: false, filename: file.name });
                  }
                });
                return true;
              });
            }
          } catch (e) {
            console.error("Upload failed", e);
          }
        };
        uploadPdf();
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
    <div className="flex flex-col w-full">
      {/* Notion-Style Table Menus */}
      {!readOnly && <TableBubbleMenu editor={editor} />}

      {/* Bubble Menu for text formatting */}
      {!readOnly && editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor, state }) => {
            const { selection } = state;
            const { empty } = selection;
            return !empty && !editor.isActive('image') && !editor.isActive('resizableImage') && !editor.isActive('table');
          }}
          tippyOptions={{ duration: 100 }} 
          className="flex items-center gap-1 p-1 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl"
        >
          <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')}><Bold className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')}><Italic className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')}><Strikethrough className="w-4 h-4" /></ToolbarButton>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}><LinkIcon className="w-4 h-4" /></ToolbarButton>
        </BubbleMenu>
      )}

      {/* Editor Content Canvas */}
      <div 
        className={readOnly ? "" : "cursor-text min-h-[500px]"} 
        onClick={() => { if (!readOnly) editor.chain().focus().run(); }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
