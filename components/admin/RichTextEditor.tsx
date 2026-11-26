'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Highlighter,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Underline,
  Unlink,
  Upload,
} from 'lucide-react';
import { markdownToHtml } from '@/lib/richText';
import { compressImageToDataUrl } from './blogEditorHelpers';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

type BlockFormat = 'p' | 'h1' | 'h2' | 'h3';
type AlignType = 'left' | 'center' | 'right' | 'justify';
type OpenMenu =
  | 'block'
  | 'size'
  | 'color'
  | 'highlight'
  | 'link'
  | 'image'
  | 'table'
  | 'align'
  | 'spacing'
  | 'info'
  | null;

const BLOCK_OPTIONS: { value: BlockFormat; label: string }[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32] as const;

const TEXT_COLORS = [
  { label: 'Default Ink', value: '#0a1018' },
  { label: 'Deep Navy', value: '#1d3f6e' },
  { label: 'Brand Blue', value: '#4f81bd' },
  { label: 'Slate', value: '#475569' },
  { label: 'Crimson', value: '#dc2626' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#d97706' },
  { label: 'White', value: '#ffffff' },
] as const;

const HIGHLIGHT_COLORS = [
  { label: 'No Highlight', value: 'transparent' },
  { label: 'Signal Yellow', value: '#fef08a' },
  { label: 'Soft Sky', value: '#dbeafe' },
  { label: 'Mint', value: '#d1fae5' },
  { label: 'Peach', value: '#ffedd5' },
  { label: 'Lavender', value: '#ede9fe' },
  { label: 'Light Grey', value: '#f1f5f9' },
] as const;

const LINE_HEIGHTS = [
  { label: '1.2 (Tight)', value: '1.2' },
  { label: '1.5 (Normal)', value: '1.5' },
  { label: '1.75 (Relaxed)', value: '1.75' },
  { label: '2.0 (Double)', value: '2.0' },
] as const;

const TABLE_GRID_CELLS = Array.from({ length: 36 }, (_, idx) => ({
  r: Math.floor(idx / 6) + 1,
  c: (idx % 6) + 1,
}));

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const initializedRef = useRef(false);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [activeBlock, setActiveBlock] = useState<BlockFormat>('p');
  const [activeSize, setActiveSize] = useState<number>(18);
  const [activeColor, setActiveColor] = useState<string>('#0a1018');
  const [activeHighlight, setActiveHighlight] = useState<string>('transparent');
  const [activeAlign, setActiveAlign] = useState<AlignType>('left');
  const [activeLineHeight, setActiveLineHeight] = useState<string>('1.75');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUl, setIsUl] = useState(false);
  const [isOl, setIsOl] = useState(false);
  const [isEmpty, setIsEmpty] = useState(() => !value.trim());
  const [linkUrl, setLinkUrl] = useState('https://');
  const [imageTab, setImageTab] = useState<'link' | 'upload'>('link');
  const [imageUrl, setImageUrl] = useState('https://');
  const [imageCaption, setImageCaption] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const [inTable, setInTable] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const syncPlainMetrics = useCallback((el: HTMLDivElement) => {
    const text = (el.textContent || '').replace(/\u00a0/g, ' ').trim();
    const hasMedia = Boolean(el.querySelector('img, table'));
    setIsEmpty(text.length === 0 && !hasMedia);
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, []);

  // Populate editor once on mount (converting legacy markdown if needed)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || initializedRef.current) return;
    initializedRef.current = true;
    const html = markdownToHtml(value);
    el.innerHTML = html;
    if (html && html !== value) {
      onChange(html);
    }
    syncPlainMetrics(el);
  }, [value, onChange, syncPlainMetrics]);

  // Close toolbar popovers on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    const el = editorRef.current;
    if (!sel || sel.rangeCount === 0 || !el) return;
    const range = sel.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  const getActiveTableElements = useCallback((): {
    cell: HTMLTableCellElement;
    row: HTMLTableRowElement;
    table: HTMLTableElement;
  } | null => {
    const el = editorRef.current;
    if (!el) return null;
    const range = savedRangeRef.current ?? window.getSelection()?.getRangeAt(0);
    if (!range || !el.contains(range.commonAncestorContainer)) return null;

    let node: Node | null = range.startContainer;
    let cell: HTMLTableCellElement | null = null;
    let row: HTMLTableRowElement | null = null;
    let table: HTMLTableElement | null = null;

    while (node && node !== el) {
      if (node instanceof HTMLTableCellElement && !cell) cell = node;
      if (node instanceof HTMLTableRowElement && !row) row = node;
      if (node instanceof HTMLTableElement && !table) table = node;
      node = node.parentNode;
    }

    if (cell && row && table) {
      return { cell, row, table };
    }
    return null;
  }, []);

  const refreshActiveStates = useCallback(() => {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0) return;
    if (!el.contains(sel.anchorNode)) return;

    saveSelection();
    setInTable(Boolean(getActiveTableElements()));

    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    setIsUl(document.queryCommandState('insertUnorderedList'));
    setIsOl(document.queryCommandState('insertOrderedList'));

    const blockVal = String(document.queryCommandValue('formatBlock') || 'p')
      .replace(/[<>]/g, '')
      .toLowerCase();
    if (blockVal === 'h1' || blockVal === 'h2' || blockVal === 'h3' || blockVal === 'p') {
      setActiveBlock(blockVal);
    } else {
      setActiveBlock('p');
    }

    if (document.queryCommandState('justifyCenter')) setActiveAlign('center');
    else if (document.queryCommandState('justifyRight')) setActiveAlign('right');
    else if (document.queryCommandState('justifyFull')) setActiveAlign('justify');
    else setActiveAlign('left');
  }, [getActiveTableElements, saveSelection]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    syncPlainMetrics(el);
    onChange(el.innerHTML);
  }, [onChange, syncPlainMetrics]);

  const runExec = useCallback(
    (command: string, commandValue?: string) => {
      restoreSelection();
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand(command, false, commandValue);
      saveSelection();
      refreshActiveStates();
      emitChange();
    },
    [emitChange, refreshActiveStates, restoreSelection, saveSelection],
  );

  const applyBlockFormat = (tag: BlockFormat) => {
    restoreSelection();
    document.execCommand('formatBlock', false, `<${tag}>`);
    setActiveBlock(tag);
    setOpenMenu(null);
    emitChange();
  };

  const applyFontSize = (px: number) => {
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('styleWithCSS', false, 'false');
      document.execCommand('fontSize', false, '7');
      const fonts = editorRef.current?.querySelectorAll('font[size="7"]');
      fonts?.forEach((fontEl) => {
        const span = document.createElement('span');
        span.style.fontSize = `${px}px`;
        span.innerHTML = fontEl.innerHTML;
        fontEl.replaceWith(span);
      });
    } else if (sel && sel.rangeCount > 0) {
      // Apply to nearest block element if no text is selected
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentNode;
      }
      if (node && node instanceof HTMLElement && node !== editorRef.current) {
        node.style.fontSize = `${px}px`;
      }
    }
    setActiveSize(px);
    setOpenMenu(null);
    emitChange();
  };

  const applyTextColor = (color: string) => {
    setActiveColor(color);
    setOpenMenu(null);
    runExec('foreColor', color);
  };

  const applyHighlightColor = (color: string) => {
    setActiveHighlight(color);
    setOpenMenu(null);
    runExec('hiliteColor', color);
  };

  const applyAlignment = (align: AlignType) => {
    setActiveAlign(align);
    setOpenMenu(null);
    const map: Record<AlignType, string> = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    };
    runExec(map[align]);
  };

  const applyLineHeight = (lh: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node: Node | null = sel.anchorNode;
      while (
        node &&
        node !== editorRef.current &&
        !(
          node instanceof HTMLElement &&
          /^(P|H1|H2|H3|H4|LI|BLOCKQUOTE|DIV)$/.test(node.tagName)
        )
      ) {
        node = node.parentNode;
      }
      if (node && node instanceof HTMLElement && node !== editorRef.current) {
        node.style.lineHeight = lh;
      } else if (editorRef.current) {
        editorRef.current.style.lineHeight = lh;
      }
    }
    setActiveLineHeight(lh);
    setOpenMenu(null);
    emitChange();
  };

  const toggleQuote = () => {
    restoreSelection();
    const current = String(document.queryCommandValue('formatBlock') || '')
      .replace(/[<>]/g, '')
      .toLowerCase();
    document.execCommand('formatBlock', false, current === 'blockquote' ? '<p>' : '<blockquote>');
    emitChange();
  };

  const toggleCode = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (!sel.isCollapsed) {
      const code = document.createElement('code');
      code.textContent = range.toString();
      range.deleteContents();
      range.insertNode(code);
      range.setStartAfter(code);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = '// code snippet';
      pre.appendChild(code);
      range.insertNode(pre);
    }
    emitChange();
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    const url = linkUrl.trim();
    if (!url || url === 'https://') {
      setOpenMenu(null);
      return;
    }
    setOpenMenu(null);
    runExec('createLink', url);
  };

  const insertImageAtCursor = useCallback(
    (src: string, caption?: string) => {
      const el = editorRef.current;
      if (!el) return;

      el.focus();
      const sel = window.getSelection();
      let range = savedRangeRef.current;
      if (!range || !el.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
      }

      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption?.trim() || 'Article image';
      img.loading = 'lazy';
      figure.appendChild(img);

      if (caption?.trim()) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = caption.trim();
        figure.appendChild(figcaption);
      }

      const trailingPara = document.createElement('p');
      trailingPara.appendChild(document.createElement('br'));

      range.deleteContents();
      range.insertNode(trailingPara);
      range.insertNode(figure);

      const nextRange = document.createRange();
      nextRange.setStart(trailingPara, 0);
      nextRange.collapse(true);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(nextRange);
      }
      savedRangeRef.current = nextRange.cloneRange();

      setOpenMenu(null);
      setImageUrl('https://');
      setImageCaption('');
      setImageError('');
      refreshActiveStates();
      emitChange();
    },
    [emitChange, refreshActiveStates],
  );

  const applyImageLink = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = imageUrl.trim();
    if (!trimmed || trimmed === 'https://' || !/^(https?:\/\/|\/)/i.test(trimmed)) {
      setImageError('Please enter a valid http(s):// or / relative image URL.');
      return;
    }
    insertImageAtCursor(trimmed, imageCaption);
  };

  const handleImageFileUpload = async (file: File | null) => {
    if (!file) return;
    setImageError('');
    setImageUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, 1400);
      insertImageAtCursor(dataUrl, imageCaption);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setImageUploading(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files || []).filter(
      (f) => f.type.startsWith('image/') || /\.avif$/i.test(f.name),
    );
    if (files.length === 0) return;
    e.preventDefault();
    saveSelection();
    await handleImageFileUpload(files[0]);
  };

  const insertTableAtCursor = useCallback(
    (rowsCount: number, colsCount: number, withHeader: boolean) => {
      const el = editorRef.current;
      if (!el) return;

      const safeRows = Math.max(1, Math.min(12, rowsCount));
      const safeCols = Math.max(1, Math.min(8, colsCount));

      el.focus();
      const sel = window.getSelection();
      let range = savedRangeRef.current;
      if (!range || !el.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
      }

      const table = document.createElement('table');
      let firstCell: HTMLTableCellElement | null = null;

      if (withHeader) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        for (let c = 0; c < safeCols; c++) {
          const th = document.createElement('th');
          th.textContent = `Column ${c + 1}`;
          tr.appendChild(th);
          if (!firstCell) firstCell = th;
        }
        thead.appendChild(tr);
        table.appendChild(thead);
      }

      const tbody = document.createElement('tbody');
      const bodyRows = withHeader ? Math.max(1, safeRows - 1) : safeRows;
      for (let r = 0; r < bodyRows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < safeCols; c++) {
          const td = document.createElement('td');
          td.appendChild(document.createElement('br'));
          tr.appendChild(td);
          if (!firstCell) firstCell = td;
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);

      const trailingPara = document.createElement('p');
      trailingPara.appendChild(document.createElement('br'));

      range.deleteContents();
      range.insertNode(trailingPara);
      range.insertNode(table);

      if (firstCell) {
        const nextRange = document.createRange();
        nextRange.selectNodeContents(firstCell);
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(nextRange);
        }
        savedRangeRef.current = nextRange.cloneRange();
      }

      setOpenMenu(null);
      setHoverCell(null);
      refreshActiveStates();
      emitChange();
    },
    [emitChange, refreshActiveStates],
  );

  const modifyActiveTable = useCallback(
    (action: 'addRow' | 'addCol' | 'delRow' | 'delCol' | 'delTable') => {
      const ctx = getActiveTableElements();
      if (!ctx) return;
      const { cell, row, table } = ctx;

      if (action === 'delTable') {
        table.remove();
        setInTable(false);
        setOpenMenu(null);
        emitChange();
        return;
      }

      if (action === 'addRow') {
        const colCount = row.cells.length || 1;
        const newRow = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
          const td = document.createElement('td');
          td.appendChild(document.createElement('br'));
          newRow.appendChild(td);
        }
        const tbody = table.tBodies[0] || table;
        if (row.parentElement === table.tHead) {
          tbody.insertBefore(newRow, tbody.firstChild);
        } else {
          row.parentElement?.insertBefore(newRow, row.nextSibling);
        }
      } else if (action === 'delRow') {
        const totalRows = table.rows.length;
        if (totalRows <= 1) {
          table.remove();
          setInTable(false);
          setOpenMenu(null);
        } else {
          row.remove();
        }
      } else if (action === 'addCol') {
        const colIndex = cell.cellIndex;
        Array.from(table.rows).forEach((r) => {
          const isHeaderRow = r.parentElement?.tagName === 'THEAD';
          const newCell = document.createElement(isHeaderRow ? 'th' : 'td');
          if (isHeaderRow) {
            newCell.textContent = `Column ${r.cells.length + 1}`;
          } else {
            newCell.appendChild(document.createElement('br'));
          }
          const refNode = r.cells[colIndex + 1] ?? null;
          r.insertBefore(newCell, refNode);
        });
      } else if (action === 'delCol') {
        const colIndex = cell.cellIndex;
        if ((table.rows[0]?.cells.length ?? 0) <= 1) {
          table.remove();
          setInTable(false);
          setOpenMenu(null);
        } else {
          Array.from(table.rows).forEach((r) => {
            if (r.cells[colIndex]) r.cells[colIndex].remove();
          });
        }
      }

      emitChange();
    },
    [emitChange, getActiveTableElements],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      const ctx = getActiveTableElements();
      if (ctx) {
        e.preventDefault();
        const allCells = Array.from(ctx.table.querySelectorAll<HTMLTableCellElement>('th, td'));
        const idx = allCells.indexOf(ctx.cell);
        const nextCell = allCells[e.shiftKey ? idx - 1 : idx + 1];
        if (nextCell) {
          const sel = window.getSelection();
          const r = document.createRange();
          r.selectNodeContents(nextCell);
          r.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(r);
          savedRangeRef.current = r.cloneRange();
        }
        return;
      }
      e.preventDefault();
      runExec(e.shiftKey ? 'outdent' : 'indent');
    }
  };

  const AlignIcon =
    activeAlign === 'center'
      ? AlignCenter
      : activeAlign === 'right'
      ? AlignRight
      : activeAlign === 'justify'
      ? AlignJustify
      : AlignLeft;

  const btnBase =
    'inline-flex h-8 cursor-pointer items-center justify-center rounded-md px-2 text-xs font-medium text-ink/80 transition-colors hover:bg-paper hover:text-ink';
  const btnActive = 'bg-paper text-deep ring-1 ring-brand/30 font-semibold';

  return (
    <div className="overflow-visible rounded-xl border border-line bg-white shadow-xs">
      {/* Microsoft Word-style Toolbar */}
      <div
        ref={toolbarRef}
        className="relative flex flex-wrap items-center gap-0.5 border-b border-line bg-white px-2.5 py-2 rounded-t-xl"
      >
        {/* 1. Block Format (Paragraph / Headings) */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'block' ? null : 'block')}
            className={`${btnBase} gap-1.5 px-2.5`}
            title="Paragraph style"
          >
            <span>{BLOCK_OPTIONS.find((b) => b.value === activeBlock)?.label ?? 'Paragraph'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
          </button>
          {openMenu === 'block' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-line bg-white p-1.5 shadow-xl">
              {BLOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyBlockFormat(opt.value)}
                  className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-paper ${
                    activeBlock === opt.value ? 'bg-paper font-bold text-deep' : 'text-ink'
                  } ${
                    opt.value === 'h1'
                      ? 'text-lg font-bold'
                      : opt.value === 'h2'
                      ? 'text-base font-bold'
                      : opt.value === 'h3'
                      ? 'text-sm font-semibold'
                      : 'text-xs'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 2. Font Size */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'size' ? null : 'size')}
            className={`${btnBase} gap-1 px-2`}
            title="Font size"
          >
            <span className="tabular-nums">{activeSize}</span>
            <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
          </button>
          {openMenu === 'size' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-24 rounded-xl border border-line bg-white p-1.5 shadow-xl">
              {FONT_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontSize(sz)}
                  className={`block w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-xs tabular-nums hover:bg-paper ${
                    activeSize === sz ? 'bg-paper font-bold text-deep' : 'text-ink'
                  }`}
                >
                  {sz} px
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 3. Bold / Italic / Underline */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('bold')}
          className={`${btnBase} w-8 px-0 ${isBold ? btnActive : ''}`}
          title="Bold (Ctrl/Cmd+B)"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('italic')}
          className={`${btnBase} w-8 px-0 ${isItalic ? btnActive : ''}`}
          title="Italic (Ctrl/Cmd+I)"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('underline')}
          className={`${btnBase} w-8 px-0 ${isUnderline ? btnActive : ''}`}
          title="Underline (Ctrl/Cmd+U)"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        {/* 4. Text Color */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'color' ? null : 'color')}
            className={`${btnBase} w-8 flex-col gap-0.5 px-0`}
            title="Text color"
            aria-label="Text color"
          >
            <span className="text-[13px] font-bold leading-none">A</span>
            <span
              className="h-1 w-4 rounded-full border border-ink/15"
              style={{ backgroundColor: activeColor }}
            />
          </button>
          {openMenu === 'color' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-line bg-white p-2.5 shadow-xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Text Color
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyTextColor(c.value)}
                    className="h-7 w-7 cursor-pointer rounded-md border border-line transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Highlight Color */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'highlight' ? null : 'highlight')}
            className={`${btnBase} w-8 flex-col gap-0.5 px-0`}
            title="Highlight color"
            aria-label="Highlight color"
          >
            <Highlighter className="h-3.5 w-3.5" />
            <span
              className="h-1 w-4 rounded-full border border-ink/15"
              style={{
                backgroundColor: activeHighlight === 'transparent' ? '#ffffff' : activeHighlight,
              }}
            />
          </button>
          {openMenu === 'highlight' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-line bg-white p-2.5 shadow-xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">
                Highlight Color
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyHighlightColor(c.value)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-line text-[10px] font-bold transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value === 'transparent' ? '#ffffff' : c.value,
                    }}
                  >
                    {c.value === 'transparent' ? '×' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 6. Link & Image */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'link' ? null : 'link')}
            className={`${btnBase} w-8 px-0`}
            title="Insert link"
            aria-label="Insert link"
          >
            <Link2 className="h-4 w-4" />
          </button>
          {openMenu === 'link' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-72 rounded-xl border border-line bg-white p-3 shadow-xl">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink/60">
                Insert Hyperlink
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyLink(e);
                    }
                  }}
                  placeholder="https://www.drivvize.com"
                  className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyLink}
                  className="shrink-0 cursor-pointer rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-deep"
                >
                  Apply
                </button>
                <button
                  type="button"
                  title="Remove link"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setOpenMenu(null);
                    runExec('unlink');
                  }}
                  className="shrink-0 cursor-pointer rounded-lg border border-line p-1.5 text-ink/65 hover:bg-paper"
                >
                  <Unlink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              setImageError('');
              setOpenMenu(openMenu === 'image' ? null : 'image');
            }}
            className={`${btnBase} gap-1.5 px-2.5 ${openMenu === 'image' ? btnActive : ''}`}
            title="Insert image (link or upload)"
            aria-label="Insert image"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-semibold">Image</span>
          </button>
          {openMenu === 'image' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-80 rounded-xl border border-line bg-white p-3.5 shadow-xl">
              <div className="mb-3 flex items-center gap-1 rounded-lg bg-paper p-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setImageError('');
                    setImageTab('link');
                  }}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                    imageTab === 'link' ? 'bg-white text-ink shadow-xs' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Image Link</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setImageError('');
                    setImageTab('upload');
                  }}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                    imageTab === 'upload'
                      ? 'bg-white text-ink shadow-xs'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              <div className="mb-2.5">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink/55">
                  Caption / Alt Text (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. ISO 26262 safety architecture diagram"
                  className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                />
              </div>

              {imageTab === 'link' ? (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/55">
                    Image URL
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageError('');
                        setImageUrl(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          applyImageLink(e);
                        }
                      }}
                      placeholder="https://example.com/diagram.png"
                      className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={applyImageLink}
                      className="shrink-0 cursor-pointer rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-deep"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*,.avif"
                    onChange={(e) => handleImageFileUpload(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    disabled={imageUploading}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/25 bg-paper/70 px-3 py-4 text-center transition-colors hover:border-brand hover:bg-paper disabled:opacity-60"
                  >
                    <Upload className="mb-1.5 h-5 w-5 text-deep" />
                    <span className="text-xs font-bold text-ink">
                      {imageUploading ? 'Processing image...' : 'Choose image from computer'}
                    </span>
                    <span className="mt-0.5 text-[10px] text-ink/55">
                      PNG, JPG, WebP, AVIF — inserted at cursor
                    </span>
                  </button>
                </div>
              )}

              {imageError && (
                <p className="mt-2 text-[11px] font-semibold text-red-600">{imageError}</p>
              )}
            </div>
          )}
        </div>

        {/* 6b. Table */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              setInTable(Boolean(getActiveTableElements()));
              setOpenMenu(openMenu === 'table' ? null : 'table');
            }}
            className={`${btnBase} gap-1.5 px-2.5 ${
              openMenu === 'table' || inTable ? btnActive : ''
            }`}
            title="Insert or edit table"
            aria-label="Insert or edit table"
          >
            <TableIcon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-semibold">Table</span>
          </button>
          {openMenu === 'table' && (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-72 rounded-xl border border-line bg-white p-3.5 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60">
                  Insert Table
                </p>
                <span className="text-[11px] font-bold tabular-nums text-deep">
                  {hoverCell ? `${hoverCell.r} × ${hoverCell.c}` : `${tableRows} × ${tableCols}`}
                </span>
              </div>

              {/* Interactive 6x6 Grid Picker */}
              <div
                className="mb-3 grid grid-cols-6 gap-1 rounded-lg border border-line bg-paper p-2"
                onMouseLeave={() => setHoverCell(null)}
              >
                {TABLE_GRID_CELLS.map(({ r, c }) => {
                  const active = hoverCell ? r <= hoverCell.r && c <= hoverCell.c : false;
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoverCell({ r, c })}
                      onClick={() => insertTableAtCursor(r, c, tableHeader)}
                      aria-label={`Insert ${r} by ${c} table`}
                      className={`h-5 w-full cursor-pointer rounded-xs border transition-colors ${
                        active
                          ? 'border-brand bg-brand/25'
                          : 'border-line bg-white hover:border-brand/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Custom Dimensions + Header Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-ink/55">
                    Rows
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value) || 1)}
                    className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-ink/55">
                    Columns
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value) || 1)}
                    className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
                  />
                </label>
              </div>

              <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-ink/75">
                <input
                  type="checkbox"
                  checked={tableHeader}
                  onChange={(e) => setTableHeader(e.target.checked)}
                  className="h-3.5 w-3.5 rounded accent-deep"
                />
                <span>Include header row</span>
              </label>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTableAtCursor(tableRows, tableCols, tableHeader)}
                className="mt-3 w-full cursor-pointer rounded-lg bg-ink py-2 text-xs font-bold text-white transition-colors hover:bg-deep"
              >
                Insert {tableRows} × {tableCols} Table
              </button>

              {inTable && (
                <div className="mt-3 border-t border-line pt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink/55">
                    Edit Active Table
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => modifyActiveTable('addRow')}
                      className="cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 text-[11px] font-semibold text-ink hover:bg-line/50"
                    >
                      + Row Below
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => modifyActiveTable('addCol')}
                      className="cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 text-[11px] font-semibold text-ink hover:bg-line/50"
                    >
                      + Col Right
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => modifyActiveTable('delRow')}
                      className="cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 text-[11px] font-semibold text-ink hover:bg-line/50"
                    >
                      Remove Row
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => modifyActiveTable('delCol')}
                      className="cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 text-[11px] font-semibold text-ink hover:bg-line/50"
                    >
                      Remove Col
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => modifyActiveTable('delTable')}
                      className="col-span-2 cursor-pointer rounded-md border border-rose-200 bg-rose-50 px-2 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                    >
                      Delete Entire Table
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 7. Quote & Code */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleQuote}
          className={`${btnBase} w-8 px-0`}
          title="Blockquote"
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleCode}
          className={`${btnBase} w-8 px-0`}
          title="Inline code or code block"
          aria-label="Code"
        >
          <Code2 className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 8. Numbered & Bullet Lists */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('insertOrderedList')}
          className={`${btnBase} w-8 px-0 ${isOl ? btnActive : ''}`}
          title="Numbered list"
          aria-label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('insertUnorderedList')}
          className={`${btnBase} w-8 px-0 ${isUl ? btnActive : ''}`}
          title="Bullet list"
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>

        {/* 9. Alignment dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'align' ? null : 'align')}
            className={`${btnBase} gap-1 px-2`}
            title="Text alignment"
            aria-label="Text alignment"
          >
            <AlignIcon className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 text-ink/50" />
          </button>
          {openMenu === 'align' && (
            <div className="absolute right-0 top-full z-30 mt-1.5 w-36 rounded-xl border border-line bg-white p-1.5 shadow-xl">
              {(
                [
                  { id: 'left', label: 'Align Left', Icon: AlignLeft },
                  { id: 'center', label: 'Center', Icon: AlignCenter },
                  { id: 'right', label: 'Align Right', Icon: AlignRight },
                  { id: 'justify', label: 'Justify', Icon: AlignJustify },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyAlignment(id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-paper ${
                    activeAlign === id ? 'bg-paper font-bold text-deep' : 'text-ink'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 10. Line Spacing dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'spacing' ? null : 'spacing')}
            className={`${btnBase} gap-1 px-2`}
            title="Line spacing"
            aria-label="Line spacing"
          >
            <span className="text-[11px] font-bold tabular-nums">↕ {activeLineHeight}</span>
            <ChevronDown className="h-3 w-3 text-ink/50" />
          </button>
          {openMenu === 'spacing' && (
            <div className="absolute right-0 top-full z-30 mt-1.5 w-40 rounded-xl border border-line bg-white p-1.5 shadow-xl">
              {LINE_HEIGHTS.map((lh) => (
                <button
                  key={lh.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyLineHeight(lh.value)}
                  className={`block w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-xs hover:bg-paper ${
                    activeLineHeight === lh.value ? 'bg-paper font-bold text-deep' : 'text-ink'
                  }`}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 11. Outdent & Indent */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('outdent')}
          className={`${btnBase} w-8 px-0`}
          title="Decrease indent (Shift+Tab)"
          aria-label="Decrease indent"
        >
          <IndentDecrease className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => runExec('indent')}
          className={`${btnBase} w-8 px-0`}
          title="Increase indent (Tab)"
          aria-label="Increase indent"
        >
          <IndentIncrease className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        {/* 12. Info / Shortcuts & Word Count */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpenMenu(openMenu === 'info' ? null : 'info')}
            className={`${btnBase} w-8 px-0`}
            title="Editor info & shortcuts"
            aria-label="Editor info"
          >
            <Info className="h-4 w-4" />
          </button>
          {openMenu === 'info' && (
            <div className="absolute right-0 top-full z-30 mt-1.5 w-60 rounded-xl border border-line bg-white p-3.5 text-xs text-ink/75 shadow-xl">
              <p className="font-bold text-ink">Word-Style Rich Text Editor</p>
              <p className="mt-1 text-[11px] text-ink/55">Words written: {wordCount}</p>
              <ul className="mt-2.5 space-y-1 text-[11px]">
                <li>
                  <span className="font-mono font-bold text-ink">Ctrl/Cmd + B</span> — Bold
                </li>
                <li>
                  <span className="font-mono font-bold text-ink">Ctrl/Cmd + I</span> — Italic
                </li>
                <li>
                  <span className="font-mono font-bold text-ink">Ctrl/Cmd + U</span> — Underline
                </li>
                <li>
                  <span className="font-mono font-bold text-ink">Tab / Shift+Tab</span> — Indent
                </li>
              </ul>
            </div>
          )}
        </div>

        <span className="ml-auto hidden font-mono text-[11px] text-ink/45 sm:inline">
          {wordCount} words
        </span>
      </div>

      {/* Document Page Canvas */}
      <div className="rounded-b-xl bg-paper/60 p-4 sm:p-6">
        <div className="relative mx-auto rounded-xl border border-line bg-white px-6 py-6 shadow-xs sm:px-10 sm:py-8">
          {isEmpty && (
            <p className="pointer-events-none absolute left-6 top-6 text-[18px] text-ink/30 sm:left-10 sm:top-8">
              Start writing your blog post like in Word — select text to format headings, font
              size, colors, lists, quotes, or links...
            </p>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Blog article content"
            onInput={emitChange}
            onMouseUp={refreshActiveStates}
            onKeyUp={refreshActiveStates}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={saveSelection}
            className="article-rich-html min-h-[360px] text-[18px] leading-[1.75] text-ink outline-none"
          />
        </div>
      </div>
    </div>
  );
}
