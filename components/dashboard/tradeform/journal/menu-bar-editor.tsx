
import React from 'react';
import {  EditorContent, BubbleMenu } from '@tiptap/react';


export const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
      return null
    }
  
    return (
        <div className="relative w-full">
        {/* 🎯 Menu contextuel flottant */}
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            placement: 'top',
            animation: 'fade',
          }}
          className="flex gap-1 rounded-md bg-muted px-2 py-1 shadow-sm border"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded-md text-sm hover:bg-muted-foreground/10 ${
              editor.isActive('bold') ? 'bg-muted-foreground/20' : ''
            }`}
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded-md text-sm hover:bg-muted-foreground/10 ${
              editor.isActive('italic') ? 'bg-muted-foreground/20' : ''
            }`}
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 rounded-md text-sm hover:bg-muted-foreground/10 ${
              editor.isActive('underline') ? 'bg-muted-foreground/20' : ''
            }`}
          >
            <u>U</u>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-2 py-1 rounded-md text-sm hover:bg-muted-foreground/10 ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-muted-foreground/20'
                : ''
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded-md text-sm hover:bg-muted-foreground/10 ${
              editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''
            }`}
          >
            • Liste
          </button>
        </BubbleMenu>
  
        {/* 📝 Editeur principal */}
        <EditorContent editor={editor} className="px-2 py-3" />
      </div>
    )
  }