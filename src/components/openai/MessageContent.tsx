import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContentProps {
  type: 'user' | 'assistant';
  content: string;
}

export function MessageContent({ type, content }: MessageContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever content changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content]);

  if (type === 'assistant') {
    return (
      <div ref={contentRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown-content prose prose-sm max-w-none"
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return <p ref={contentRef} className="text-white">{content}</p>;
}