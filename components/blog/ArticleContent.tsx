'use client';

import React from 'react';

interface ArticleContentProps {
  content: string;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(raw: string): string {
  let html = escapeHtml(raw);

  // Links: allow only http(s):// or root-relative / paths
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-semibold text-deep underline decoration-signal decoration-2 underline-offset-4 hover:text-brand">$1</a>',
  );

  return html
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-deep">$1</code>',
    );
}

export function ArticleContent({ content }: ArticleContentProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let quoteLines: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushParagraph = (key: string) => {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines.join(' ');
    elements.push(
      <p
        key={key}
        className="mb-6 text-[18px] leading-[1.85] text-ink/75"
        dangerouslySetInnerHTML={{ __html: formatInline(text) }}
      />,
    );
    paragraphLines = [];
  };

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    if (listOrdered) {
      elements.push(
        <ol key={key} className="my-8 list-decimal space-y-3 pl-6 text-[17px] text-ink/80">
          {listItems.map((item, i) => (
            <li
              key={i}
              className="leading-[1.7] pl-1"
              dangerouslySetInnerHTML={{ __html: formatInline(item) }}
            />
          ))}
        </ol>,
      );
    } else {
      elements.push(
        <ul key={key} className="my-8 space-y-3">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-4 text-[17px] leading-[1.7] text-ink/80">
              <i className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>,
      );
    }
    listItems = [];
  };

  const flushQuote = (key: string) => {
    if (quoteLines.length === 0) return;
    elements.push(
      <blockquote
        key={key}
        className="my-8 border-l-[3px] border-signal bg-paper/70 px-6 py-4 text-[17px] italic leading-relaxed text-ink/75"
        dangerouslySetInnerHTML={{ __html: formatInline(quoteLines.join(' ')) }}
      />,
    );
    quoteLines = [];
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph(`p-code-${index}`);
      flushList(`ul-code-${index}`);
      flushQuote(`q-code-${index}`);
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-8 overflow-x-auto rounded-xl bg-ink p-5 font-mono text-xs sm:text-sm leading-relaxed text-white"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>,
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      return;
    }

    if (!trimmed) {
      flushParagraph(`p-${index}`);
      flushList(`ul-${index}`);
      flushQuote(`q-${index}`);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph(`p-h3-${index}`);
      flushList(`ul-h3-${index}`);
      flushQuote(`q-h3-${index}`);
      elements.push(
        <h3
          key={`h3-${index}`}
          className="mb-4 mt-10 text-2xl font-light tracking-tight text-ink"
        >
          {trimmed.slice(4)}
        </h3>,
      );
    } else if (trimmed.startsWith('## ')) {
      flushParagraph(`p-h2-${index}`);
      flushList(`ul-h2-${index}`);
      flushQuote(`q-h2-${index}`);
      elements.push(
        <h2
          key={`h2-${index}`}
          className="mb-5 mt-14 border-b border-line pb-2 text-3xl font-light tracking-tight text-ink"
        >
          {trimmed.slice(3)}
        </h2>,
      );
    } else if (trimmed.startsWith('# ')) {
      flushParagraph(`p-h1-${index}`);
      flushList(`ul-h1-${index}`);
      flushQuote(`q-h1-${index}`);
      elements.push(
        <h2
          key={`h1-${index}`}
          className="mb-5 mt-14 text-3xl font-semibold tracking-tight text-ink"
        >
          {trimmed.slice(2)}
        </h2>,
      );
    } else if (trimmed.startsWith('> ')) {
      flushParagraph(`p-q-${index}`);
      flushList(`ul-q-${index}`);
      quoteLines.push(trimmed.slice(2));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph(`p-li-${index}`);
      flushQuote(`q-li-${index}`);
      if (listItems.length > 0 && listOrdered) {
        flushList(`ul-switch-${index}`);
      }
      listOrdered = false;
      listItems.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph(`p-oli-${index}`);
      flushQuote(`q-oli-${index}`);
      if (listItems.length > 0 && !listOrdered) {
        flushList(`ol-switch-${index}`);
      }
      listOrdered = true;
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
    } else {
      flushList(`ul-p-${index}`);
      flushQuote(`q-p-${index}`);
      paragraphLines.push(trimmed);
    }
  });

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre
        key="final-code"
        className="my-8 overflow-x-auto rounded-xl bg-ink p-5 font-mono text-xs sm:text-sm leading-relaxed text-white"
      >
        <code>{codeLines.join('\n')}</code>
      </pre>,
    );
  }

  flushParagraph('final-p');
  flushList('final-ul');
  flushQuote('final-q');

  return <div className="article-body">{elements}</div>;
}
