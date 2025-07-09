import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import { useEffect, useState } from "react";
import { htmlToMarkdown, markdownToHtml } from "../../utils/markdownUtils";

interface Props {
  value: string;
  onChange: (val: string) => void;
  mode: "visual" | "vim";
}

export function useEditorLogic({ value, onChange, mode }: Props) {
  const [internalValue, setInternalValue] = useState(value);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    content: markdownToHtml(value),
    extensions: [StarterKit, Underline, ListItem, Blockquote, TextStyle, Color],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const md = htmlToMarkdown(html);
      setInternalValue(md);
      onChange(md);
      setWordCount(md.trim().split(/\s+/).length);
    },
  });

  useEffect(() => {
    if (editor && mode === "visual") {
      editor.commands.setContent(markdownToHtml(value));
    }
  }, [mode, editor]);

  const handleVimChange = (md: string) => {
    setInternalValue(md);
    onChange(md);
    setWordCount(md.trim().split(/\s+/).length);
    if (editor) {
      editor.commands.setContent(markdownToHtml(md));
    }
  };

  const toggleMarkdown = (type: "bold" | "italic" | "underline") => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (type === "bold") chain.toggleBold().run();
    if (type === "italic") chain.toggleItalic().run();
    if (type === "underline") chain.toggleUnderline().run();
  };

  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleQuote = () => editor?.chain().focus().toggleBlockquote().run();
  const setColor = (color: string) =>
    editor?.chain().focus().setColor(color).run();

  const isBoldActive = editor?.isActive("bold") ?? false;
  const isItalicActive = editor?.isActive("italic") ?? false;
  const isUnderlineActive = editor?.isActive("underline") ?? false;
  const isBulletActive = editor?.isActive("bulletList") ?? false;
  const isOrderedActive = editor?.isActive("orderedList") ?? false;
  const isQuoteActive = editor?.isActive("blockquote") ?? false;

  return {
    internalValue,
    wordCount,
    editor,
    handleVimChange,
    toggleMarkdown,
    toggleBullet,
    toggleOrdered,
    toggleQuote,
    setColor,
    isBoldActive,
    isItalicActive,
    isUnderlineActive,
    isBulletActive,
    isOrderedActive,
    isQuoteActive,
  };
}
