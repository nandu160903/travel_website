"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Quote,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onAutoSave?: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  onAutoSave,
  placeholder = "Start writing your story...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap px-4 py-3 min-h-[300px] focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const autoSave = useCallback(() => {
    if (editor && onAutoSave) {
      onAutoSave(editor.getHTML());
    }
  }, [editor, onAutoSave]);

  useEffect(() => {
    if (!onAutoSave) return;
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave, onAutoSave]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded hover:bg-muted-bg transition-colors",
        active && "bg-ocean/10 text-ocean"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted-bg/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
