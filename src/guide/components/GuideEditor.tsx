import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import HardBreak from "@tiptap/extension-hard-break";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { vim } from "@replit/codemirror-vim";
import { markdownToHtml, htmlToMarkdown } from "../../utils/markdownUtils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List as BulletIcon,
  ListOrdered,
  Quote,
  Type,
  Eye,
  Terminal,
} from "lucide-react";

interface GuideEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function GuideEditor({
  value,
  onChange,
  placeholder,
}: GuideEditorProps) {
  const [mode, setMode] = useState<"visual" | "vim">("visual");
  const [wordCount, setWordCount] = useState(0);
  const [internalValue, setInternalValue] = useState(value);
  const [lastMode, setLastMode] = useState<"visual" | "vim">(mode);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: {},
        bulletList: false,
        orderedList: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Blockquote,
      TextStyle,
      Color,
      HardBreak.configure({ keepMarks: true }),
    ],
    content: markdownToHtml(internalValue),
    onUpdate({ editor }) {
      if (mode === "visual") {
        const html = editor.getHTML();
        const md = htmlToMarkdown(html);
        setInternalValue(md);
        onChange(md);
      }
    },
    editorProps: {
      handleKeyDown(_, event) {
        if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault();
          editor?.commands.setHardBreak();
          return true;
        }
        return false;
      },
      attributes: {
        class: internalValue ? "" : "is-empty",
        "data-placeholder": placeholder || "Escribe aquí…",
      },
    },
  });

  useEffect(() => {
    if (editor && mode === "visual") {
      editor.commands.setContent(markdownToHtml(value));
    }
  }, [value, editor, mode]);

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleQuote = () => editor?.chain().focus().toggleBlockquote().run();
  const setColor = (color: string) =>
    editor?.chain().focus().setColor(color).run();

  const isBoldActive = !!editor?.isActive("bold");
  const isItalicActive = !!editor?.isActive("italic");
  const isUnderlineActive = !!editor?.isActive("underline");
  const isBulletActive = !!editor?.isActive("bulletList");
  const isOrderedActive = !!editor?.isActive("orderedList");
  const isQuoteActive = !!editor?.isActive("blockquote");

  useEffect(() => {
    if (mode === "visual" && lastMode !== "visual" && editor) {
      editor.commands.setContent(markdownToHtml(internalValue));
      setLastMode("visual");
    }
    if (mode === "vim" && lastMode !== "vim") {
      setLastMode("vim");
    }
  }, [mode, lastMode, editor, internalValue]);

  const handleVimChange = (val: string) => {
    setInternalValue(val);
    onChange(val);
  };

  useEffect(() => {
    const text = internalValue
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const words = text === "" ? 0 : text.split(" ").length;
    setWordCount(words);
  }, [internalValue]);

  const toggleMarkdown = (type: "bold" | "italic" | "underline") => {
    if (mode === "visual") {
      if (type === "bold") toggleBold();
      if (type === "italic") toggleItalic();
      if (type === "underline") toggleUnderline();
    } else {
      const selected = window.getSelection()?.toString() || "";
      let wrapped = selected;
      if (type === "bold") wrapped = `**${selected}**`;
      if (type === "italic") wrapped = `*${selected}*`;
      if (type === "underline") wrapped = `<u>${selected}</u>`; // Markdown no tiene subrayado
      const newValue = internalValue + wrapped;
      setInternalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--c-bg)] rounded-xl shadow-lg border border-[var(--c-border)] overflow-hidden">
      <div className="bg-[var(--c-dropdown-bg)] border-b border-[var(--c-border)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-[var(--c-dropdown-bg)] rounded-lg p-1 shadow-sm border border-[var(--c-border)]/60">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                mode === "visual"
                  ? "bg-sky-400 text-white shadow-md transform "
                  : "text-[var(--c-text)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg-hover)]"
              }`}
            >
              <Eye size={16} />
              Visual
            </button>
            <button
              type="button"
              onClick={() => setMode("vim")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                mode === "vim"
                  ? "bg-emerald-500 text-white shadow-md transform "
                  : "text-[var(--c-text)] hover:text-[var(--c-text)] hover:bg-[var(--c-bg-hover)]"
              }`}
            >
              <Terminal size={16} />
              Vim
            </button>
          </div>

          <div className="text-sm text-[var(--c-text)]/50 bg-[var(--c-dropdown-bg)] px-3 py-1.5 rounded-full border border-[var(--c-border)]/70">
            <span className="font-medium text-[var(--c-text)]/70">{wordCount}</span>{" "}
            palabras
          </div>
        </div>
      </div>

      <div className="bg-[var(--c-dropdown-bg)] border-b border-[var(--c-border)]/60 px-6 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center bg-[var(--c-dropdown-bg)]  rounded-lg border border-[var(--c-border)] shadow-sm p-1">
            <button
              type="button"
              onClick={() => toggleMarkdown("bold")}
              title="Negrita (Ctrl+B)"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isBoldActive
                  ? "bg-sky-600/10 text-sky-600 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => toggleMarkdown("italic")}
              title="Cursiva (Ctrl+I)"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isItalicActive
                  ? "bg-sky-600/10 text-sky-700 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => toggleMarkdown("underline")}
              title="Subrayado (Ctrl+U)"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isUnderlineActive
                  ? "bg-sky-600/10 text-sky-700 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <UnderlineIcon size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-[var(--c-border)]/70 mx-1"></div>

          <div className="flex items-center bg-[var(--c-dropdown-bg)]  rounded-lg border border-[var(--c-border)]/70 shadow-sm p-1">
            <button
              type="button"
              onClick={toggleBullet}
              title="Lista con viñetas"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isBulletActive
                  ? "bg-sky-600/10 text-sky-700 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <BulletIcon size={16} />
            </button>
            <button
              type="button"
              onClick={toggleOrdered}
              title="Lista numerada"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isOrderedActive
                  ? "bg-sky-600/10 text-sky-700 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              onClick={toggleQuote}
              title="Cita"
              className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
                isQuoteActive
                  ? "bg-sky-600/10 text-sky-700 shadow-sm"
                  : "text-[var(--c-text)]/50 hover:bg-[var(--c-bg-hover2)] hover:text-[var(--c-text=]/70"
              }`}
            >
              <Quote size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-[var(--c-dropdown-bg)]  mx-1"></div>

          <div className="flex items-center bg-[var(--c-dropdown-bg)]  rounded-lg border border-[var(--c-border)]/70 shadow-sm p-1">
            <div className="flex items-center gap-2 px-2">
              <Type size={16} className="text-[var(--c-text)]/50" />
              <select
                onChange={(e) => setColor(e.target.value)}
                className="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none text-[var(--c-text)]/50  cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Color
                </option>
                <option value="#000000">⚫ Negro</option>
                <option value="#e11d48">🔴 Rojo</option>
                <option value="#2563eb">🔵 Azul</option>
                <option value="#10b981">🟢 Verde</option>
                <option value="#f59e0b">🟡 Naranja</option>
                <option value="#8b5cf6">🟣 Violeta</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {mode === "visual" && editor && (
        <div className="bg-[var(--c-dropdown-bg)] ">
          <div className=" p-8 min-h-[400px] max-h-[600px] overflow-y-auto">
            <EditorContent
              editor={editor}
              className="prose prose-lg max-w-none
                focus:outline-none
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[var(--c-text)]/80 [&_h1]:mb-6 [&_h1]:mt-8
                [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--c-text)]/80 [&_h2]:mb-4 [&_h2]:mt-6
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--c-text)]/80 [&_h3]:mb-3 [&_h3]:mt-5
                [&_p]:text-[var(--c-text)]/80 [&_p]:leading-relaxed [&_p]:mb-4
                [&_blockquote]:border-l-4 [&_blockquote]:border-sky-400 [&_blockquote]:pl-6 [&_blockquote]:py-2 
                [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-sky-50/50 [&_blockquote]:rounded-r-lg
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                [&_li]:text-[var(--c-text)]/80 [&_li]:leading-relaxed
                [&_strong]:font-semibold [&_strong]:text-[var(--c-text)]/85
                [&_em]:italic [&_em]:text-[var(--c-text)]/80
                [&_span]:text-inherit [&_span]:font-inherit
                [&_span][style*='color']:text-[unset] [&_span][style*='color']
                transition-all duration-200"
            />
          </div>
        </div>
      )}

      {mode === "vim" && (
        <div className="bg-gray-900">
          <CodeMirror
            value={internalValue}
            height="400px"
            extensions={[markdown(), vim()]}
            onChange={handleVimChange}
            placeholder={placeholder || "Escribe el contenido en Markdown..."}
            theme="dark"
            className="text-sm"
          />
        </div>
      )}

      <style>{`
        .ProseMirror.is-empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }

        .ProseMirror:focus {
          outline: none;
        }

        /* Animaciones suaves */
        .ProseMirror * {
          transition: color 0.2s ease, background-color 0.2s ease;
        }

        /* Mejoras en la selección de texto */
        .ProseMirror ::selection {
          background: rgba(59, 130, 246, 0.2);
        }

        /* Hover effects mejorados */
        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        /* CodeMirror styling improvements */
        .cm-editor {
          border-radius: 0;
        }

        .cm-focused {
          outline: none;
        }
      `}</style>
    </div>
  );
}
