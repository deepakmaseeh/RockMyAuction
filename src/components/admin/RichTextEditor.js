'use client';

import { useEffect, useRef } from 'react';

const COMMANDS = [
  { icon: 'B', label: 'Bold', command: 'bold' },
  { icon: 'I', label: 'Italic', command: 'italic' },
  { icon: 'U', label: 'Underline', command: 'underline' },
  { icon: '•', label: 'Bullet List', command: 'insertUnorderedList' },
  { icon: '1.', label: 'Numbered List', command: 'insertOrderedList' },
  { icon: 'Link', label: 'Insert Link', command: 'createLink' },
  { icon: 'Clear', label: 'Clear Formatting', command: 'removeFormat' },
];

function focusEditable(ref) {
  if (!ref?.current) return;
  ref.current.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(ref.current);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  className = '',
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    if (value && value !== currentHtml) {
      editorRef.current.innerHTML = value;
    }
    if (!value && currentHtml) {
      editorRef.current.innerHTML = '';
    }
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) return;
    onChange?.(editorRef.current.innerHTML);
  };

  const handleCommand = (command) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL');
      if (url) {
        document.execCommand(command, false, url);
      }
      return;
    }
    document.execCommand(command, false, null);
    handleInput();
    focusEditable(editorRef);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="rt-toolbar">
        {COMMANDS.map((action) => (
          <button
            key={action.command}
            type="button"
            onClick={() => handleCommand(action.command)}
            className="rt-button"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rt-editor"
        contentEditable
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}

