"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
};

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder,
  ariaLabel,
}: Props) {
  const [markdown, setMarkdown] = useState(defaultValue);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Markdown.configure({
        html: false,
        breaks: true,
        transformPastedText: true,
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate({ editor }) {
      const storage = editor.storage as unknown as { markdown: MarkdownStorage };
      setMarkdown(storage.markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="rte" aria-busy="true">
        <div className="rte-toolbar" />
        <div className="rte-content rte-content--loading">Loading editor…</div>
        <input type="hidden" name={name} value={defaultValue} />
      </div>
    );
  }

  return (
    <div className="rte">
      <Toolbar editor={editor} colorInputRef={colorInputRef} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={markdown} />
      <input
        ref={colorInputRef}
        type="color"
        aria-hidden="true"
        tabIndex={-1}
        className="rte-color-input"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />
    </div>
  );
}

function Toolbar({
  editor,
  colorInputRef,
}: {
  editor: Editor;
  colorInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const promptForLink = () => {
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const promptForImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
      <Group>
        <TBtn
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 size={15} />
        </TBtn>
        <TBtn
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 size={15} />
        </TBtn>
      </Group>

      <Group>
        <TBtn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </TBtn>
        <TBtn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </TBtn>
        <TBtn
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </TBtn>
        <TBtn
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </TBtn>
        <TBtn
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={15} />
        </TBtn>
      </Group>

      <Group>
        <TBtn
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={15} />
        </TBtn>
        <TBtn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={15} />
        </TBtn>
        <TBtn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={15} />
        </TBtn>
      </Group>

      <Group>
        <TBtn
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </TBtn>
        <TBtn
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </TBtn>
        <TBtn
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </TBtn>
        <TBtn
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </TBtn>
      </Group>

      <Group>
        <TBtn
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={15} />
        </TBtn>
        <TBtn
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={15} />
        </TBtn>
        <TBtn
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={15} />
        </TBtn>
      </Group>

      <Group>
        <TBtn
          title="Link"
          active={editor.isActive("link")}
          onClick={promptForLink}
        >
          <Link2 size={15} />
        </TBtn>
        <TBtn title="Image" onClick={promptForImage}>
          <ImageIcon size={15} />
        </TBtn>
        <TBtn
          title="Text color"
          onClick={() => colorInputRef.current?.click()}
        >
          <Palette size={15} />
        </TBtn>
      </Group>
    </div>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="rte-group">{children}</div>;
}

function TBtn({
  title,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className="rte-btn"
      data-active={active}
    >
      {children}
    </button>
  );
}
