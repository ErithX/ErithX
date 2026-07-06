import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Type, Heading1, Heading2, List, ListOrdered, Quote, Code, Image as ImageIcon, Info, LayoutGrid } from 'lucide-react';
import { Editor, Range } from '@tiptap/core';

export interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

export const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
  return [
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      icon: <Type className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('paragraph').run();
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: <Heading1 className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: <Heading2 className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bulleted list.',
      icon: <List className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      icon: <ListOrdered className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      icon: <Quote className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: 'Callout',
      description: 'Highlight important information.',
      icon: <Info className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).insertContent('<div data-type="callout" data-intent="info"></div>').run();
      },
    },
    {
      title: 'Table',
      description: 'Insert a customizable table.',
      icon: <LayoutGrid className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
      title: 'Code Block',
      description: 'Add a snippet of code.',
      icon: <Code className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setCodeBlock().run();
      },
    },
    {
      title: 'Image',
      description: 'Upload an image from your device.',
      icon: <ImageIcon className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            editor.chain().focus().deleteRange(range).insertContent({
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
                        tr.setNodeMarkup(pos, undefined, { src: data.url, isUploading: false });
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
      },
    },
    {
      title: 'PDF Document',
      description: 'Upload and embed a PDF file.',
      icon: <Type className="w-4 h-4" />,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            editor.chain().focus().deleteRange(range).insertContent({
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
                        tr.setNodeMarkup(pos, undefined, { src: data.url, isUploading: false, filename: file.name });
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
      },
    },
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
};

export const SlashCommandList = forwardRef<any, { items: CommandItem[], command: (item: CommandItem) => void }>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useEffect(() => {
    const el = document.getElementById(`slash-item-${selectedIndex}`);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-4 w-64 shadow-2xl overflow-hidden bg-[#09090b]/60 backdrop-blur-xl">
        <p className="text-sm text-zinc-500 text-center">No results</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 w-64 shadow-2xl overflow-hidden bg-[#09090b]/30 backdrop-blur-xl max-h-80 flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
        Basic Blocks
      </div>
      <div className="overflow-y-auto p-1 scrollbar-thin">
        {props.items.map((item, index) => (
          <button
            key={index}
            id={`slash-item-${index}`}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${index === selectedIndex
                ? 'bg-emerald-500/20 text-white'
                : 'text-zinc-300 hover:bg-white/5'
              }`}
            onClick={() => selectItem(index)}
          >
            <div className={`flex items-center justify-center p-2 rounded-md ${index === selectedIndex ? 'bg-emerald-500/30' : 'bg-white/5'}`}>
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-zinc-500 line-clamp-1">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';
