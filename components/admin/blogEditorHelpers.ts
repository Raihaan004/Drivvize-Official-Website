export interface MarkdownTool {
  label: string;
  title: string;
  prefix: string;
  suffix?: string;
  placeholder: string;
  block?: boolean;
}

export const MARKDOWN_TOOLS: MarkdownTool[] = [
  { label: 'H2', title: 'Section Heading', prefix: '## ', placeholder: 'Section Heading', block: true },
  { label: 'H3', title: 'Subheading', prefix: '### ', placeholder: 'Subheading', block: true },
  { label: 'Bold', title: 'Bold Text', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { label: 'Italic', title: 'Italic Text', prefix: '*', suffix: '*', placeholder: 'italic text' },
  { label: 'List', title: 'Bullet List', prefix: '- ', placeholder: 'List item', block: true },
  { label: '1. List', title: 'Numbered List', prefix: '1. ', placeholder: 'First item', block: true },
  { label: 'Quote', title: 'Blockquote', prefix: '> ', placeholder: 'Key takeaway or quote', block: true },
  { label: 'Code', title: 'Inline Code', prefix: '`', suffix: '`', placeholder: 'ASIL-D' },
  { label: 'Block', title: 'Code Block', prefix: '```\n', suffix: '\n```', placeholder: '// code snippet', block: true },
  { label: 'Link', title: 'Link', prefix: '[', suffix: '](https://www.drivvize.com)', placeholder: 'link text' },
];

export function applyMarkdownTool(
  textarea: HTMLTextAreaElement | null,
  currentValue: string,
  tool: MarkdownTool,
): { nextValue: string; selectionStart: number; selectionEnd: number } {
  if (!textarea) {
    const snippet = `${tool.block && currentValue ? '\n\n' : ''}${tool.prefix}${tool.placeholder}${tool.suffix ?? ''}`;
    const nextValue = `${currentValue}${snippet}`;
    return { nextValue, selectionStart: nextValue.length, selectionEnd: nextValue.length };
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end) || tool.placeholder;
  const needsLeadingNewline =
    tool.block && start > 0 && currentValue[start - 1] !== '\n' ? '\n\n' : '';
  const insertion = `${needsLeadingNewline}${tool.prefix}${selected}${tool.suffix ?? ''}`;

  const nextValue =
    currentValue.slice(0, start) + insertion + currentValue.slice(end);
  const selStart = start + needsLeadingNewline.length + tool.prefix.length;
  const selEnd = selStart + selected.length;

  return { nextValue, selectionStart: selStart, selectionEnd: selEnd };
}

export function compressImageToDataUrl(file: File, maxDimension = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const webp = canvas.toDataURL('image/webp', 0.82);
        const result = webp.startsWith('data:image/webp')
          ? webp
          : canvas.toDataURL('image/jpeg', 0.82);

        resolve(result);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function formatFileSizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function readDocumentAsDataUrl(file: File, maxBytes = 5 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error('Document must be 5 MB or smaller for direct upload (or paste an external URL).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected document.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

