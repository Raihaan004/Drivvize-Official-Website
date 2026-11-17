'use client';

import React from 'react';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Simple markdown processor for paragraphs, headings, bullet lists, bold, and code
  const renderBlocks = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];

    const flushParagraph = (key: string) => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        elements.push(
          <p
            key={key}
            className="text-base sm:text-lg text-ink/80 leading-relaxed font-sans mb-6"
            dangerouslySetInnerHTML={{ __html: formatInline(text) }}
          />,
        );
        currentParagraph = [];
      }
    };

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} className="space-y-2.5 my-6 pl-6 list-disc text-ink/80 text-base sm:text-lg">
            {currentList.map((item, i) => (
              <li
                key={i}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInline(item) }}
              />
            ))}
          </ul>,
        );
        currentList = [];
      }
    };

    const formatInline = (str: string) => {
      return str
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-ink">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-paper text-deep font-mono text-xs font-semibold border border-line">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph(`p-${index}`);
        flushList(`ul-${index}`);
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushParagraph(`p-before-h3-${index}`);
        flushList(`ul-before-h3-${index}`);
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-xl sm:text-2xl font-extrabold text-ink font-heading mt-10 mb-4 tracking-tight"
          >
            {trimmed.slice(4)}
          </h3>,
        );
      } else if (trimmed.startsWith('## ')) {
        flushParagraph(`p-before-h2-${index}`);
        flushList(`ul-before-h2-${index}`);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-2xl sm:text-3xl font-extrabold text-ink font-heading mt-12 mb-6 tracking-tight pb-2 border-b border-line"
          >
            {trimmed.slice(3)}
          </h2>,
        );
      } else if (trimmed.startsWith('# ')) {
        flushParagraph(`p-before-h1-${index}`);
        flushList(`ul-before-h1-${index}`);
        elements.push(
          <h1
            key={`h1-${index}`}
            className="text-3xl sm:text-4xl font-extrabold text-ink font-heading mt-12 mb-6 tracking-tight"
          >
            {trimmed.slice(2)}
          </h1>,
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph(`p-before-li-${index}`);
        currentList.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph(`p-before-oli-${index}`);
        currentList.push(trimmed.replace(/^\d+\.\s/, ''));
      } else {
        flushList(`ul-before-p-${index}`);
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph('final-p');
    flushList('final-ul');

    return elements;
  };

  return <div className="article-body">{renderBlocks()}</div>;
}

