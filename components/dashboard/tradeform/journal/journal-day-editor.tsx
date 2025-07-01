'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { JournalEntry } from '@/types/trading';
import { Label } from '@radix-ui/react-label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { SelectItem } from '@radix-ui/react-select';
import { Card } from '../../../ui/card';
import { MenuBar } from './menu-bar-editor';

const MOODS = [
  { value: 'confident', label: 'Confiant', emoji: '😊' },
  { value: 'optimistic', label: 'Optimiste', emoji: '🙂' },
  { value: 'neutral', label: 'Neutre', emoji: '😐' },
  { value: 'pessimistic', label: 'Pessimiste', emoji: '😕' },
  { value: 'depressed', label: 'Déprimé', emoji: '😢' },
  { value: 'stressed', label: 'Stressé', emoji: '🤔' },
];

interface JournalDayEditorProps {
  journal: JournalEntry | null;
  onJournalUpdate: (journal: JournalEntry) => void;
}

export function JournalDayEditor({
  journal,
  onJournalUpdate,
}: JournalDayEditorProps) {
  const [mood, setMood] = useState(journal?.mood || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {},
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Écrivez votre journal ici...',
        emptyEditorClass:
          'cursor-text before:content-[attr(data-placeholder)] before:absolute before:opacity-50 before:pointer-events-none before:text-muted-foreground',
      }),
      BulletList,
      ListItem,
      Heading,
      Bold,
      Italic,
      Underline,
    ],
    content: journal?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert focus:outline-none max-w-none min-h-[150px] px-3 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      onJournalUpdate({
        content: editor.getHTML(),
        mood,
      });
    },
  });

  const handleMoodChange = (value: string) => {
    setMood(value);
    onJournalUpdate({
      content: editor?.getHTML() || '',
      mood: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {MOODS.map((moodOption) => (
              <div key={moodOption.value} className="group relative">
                <button
                  onClick={() => handleMoodChange(moodOption.value)}
                  className={`rounded-full p-2 text-2xl transition-all hover:scale-110 ${
                    mood === moodOption.value
                      ? 'bg-gray-500 text-white ring-2 ring-gray-500'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {moodOption.emoji}
                </button>
                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {moodOption.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
