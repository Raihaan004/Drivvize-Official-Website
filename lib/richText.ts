function escapeHtmlText(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isHtmlContent(value: string): boolean {
  return /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|code|span|strong|b|em|i|u|a|br)\b[^>]*>/i.test(
    value.trim(),
  );
}

function formatMarkdownInline(raw: string): string {
  let html = escapeHtmlText(raw);
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * Converts legacy Markdown blog content into editable HTML for the Word-style editor.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return '';
  if (isHtmlContent(markdown)) return markdown;

  const lines = markdown.split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let ordered = false;
  let quote: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${formatMarkdownInline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const tag = ordered ? 'ol' : 'ul';
    out.push(`<${tag}>${list.map((li) => `<li>${formatMarkdownInline(li)}</li>`).join('')}</${tag}>`);
    list = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    out.push(`<blockquote>${formatMarkdownInline(quote.join(' '))}</blockquote>`);
    quote = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('```')) {
      flushPara();
      flushList();
      flushQuote();
      if (inCode) {
        out.push(`<pre><code>${escapeHtmlText(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }
    if (!trimmed) {
      flushPara();
      flushList();
      flushQuote();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushPara();
      flushList();
      flushQuote();
      out.push(`<h3>${formatMarkdownInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      flushPara();
      flushList();
      flushQuote();
      out.push(`<h2>${formatMarkdownInline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith('# ')) {
      flushPara();
      flushList();
      flushQuote();
      out.push(`<h1>${formatMarkdownInline(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith('> ')) {
      flushPara();
      flushList();
      quote.push(trimmed.slice(2));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushPara();
      flushQuote();
      if (list.length && ordered) flushList();
      ordered = false;
      list.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushPara();
      flushQuote();
      if (list.length && !ordered) flushList();
      ordered = true;
      list.push(trimmed.replace(/^\d+\.\s/, ''));
    } else {
      flushList();
      flushQuote();
      para.push(trimmed);
    }
  }

  if (inCode && codeLines.length) {
    out.push(`<pre><code>${escapeHtmlText(codeLines.join('\n'))}</code></pre>`);
  }
  flushPara();
  flushList();
  flushQuote();
  return out.join('');
}

const ALLOWED_CSS_PROPS = new Set([
  'color',
  'background-color',
  'font-size',
  'text-align',
  'line-height',
  'margin-left',
  'padding-left',
  'font-weight',
  'font-style',
  'text-decoration',
]);

function sanitizeStyleAttribute(styleValue: string): string {
  return styleValue
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const colonIdx = decl.indexOf(':');
      if (colonIdx === -1) return '';
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl.slice(colonIdx + 1).trim();
      if (!ALLOWED_CSS_PROPS.has(prop)) return '';
      if (/url\s*\(|expression\s*\(|javascript:/i.test(val)) return '';
      return `${prop}: ${val}`;
    })
    .filter(Boolean)
    .join('; ');
}

const ALLOWED_TAGS = new Set([
  'p',
  'div',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'span',
  'font',
  'hr',
]);

/**
 * Sanitizes rich-text HTML authored in the editor so scripts/event handlers are stripped
 * while preserving safe formatting (headings, colors, highlights, alignment, spacing, links).
 */
export function sanitizeBlogHtml(html: string): string {
  // Remove dangerous block elements outright
  const withoutDangerous = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<(iframe|object|embed|form|input|button|textarea|select|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|form|input|button|meta|link)[^>]*\/?>/gi, '');

  return withoutDangerous.replace(
    /<(\/?)([a-z0-9]+)([^>]*)>/gi,
    (match, slash: string, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return '';
      if (slash) return `</${tag}>`;

      if (tag === 'br' || tag === 'hr') {
        return `<${tag} />`;
      }

      const attrs: string[] = [];

      const styleMatch = rawAttrs.match(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const rawStyle = styleMatch?.[1] ?? styleMatch?.[2] ?? '';
      const safeStyle = rawStyle ? sanitizeStyleAttribute(rawStyle) : '';
      if (safeStyle) {
        attrs.push(`style="${escapeHtmlText(safeStyle)}"`);
      }

      if (tag === 'a') {
        const hrefMatch = rawAttrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
        const href = (hrefMatch?.[1] ?? hrefMatch?.[2] ?? '').trim();
        if (/^(https?:\/\/|mailto:|\/|#)/i.test(href)) {
          attrs.push(`href="${escapeHtmlText(href)}"`);
          attrs.push('target="_blank"');
          attrs.push('rel="noopener noreferrer"');
        }
      }

      if (tag === 'font') {
        const colorMatch = rawAttrs.match(/\bcolor\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
        const color = (colorMatch?.[1] ?? colorMatch?.[2] ?? '').trim();
        if (color && !/javascript:|url\(/i.test(color)) {
          attrs.push(`color="${escapeHtmlText(color)}"`);
        }
      }

      return attrs.length > 0 ? `<${tag} ${attrs.join(' ')}>` : `<${tag}>`;
    },
  );
}

