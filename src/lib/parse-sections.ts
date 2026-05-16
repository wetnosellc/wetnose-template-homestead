// Splits a markdown body string into sections by h2 headings.
// Returns an array of { heading, html } objects where html is the
// section body converted to basic HTML paragraphs.
export function parseSections(body: string): Array<{ heading: string; html: string }> {
  const chunks = body.split(/\n(?=## )/);
  const sections: Array<{ heading: string; html: string }> = [];
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed.startsWith('## ')) continue;
    const nl = trimmed.indexOf('\n');
    const heading = nl === -1 ? trimmed.slice(3) : trimmed.slice(3, nl).trim();
    const rest = nl === -1 ? '' : trimmed.slice(nl + 1).trim();
    sections.push({ heading, html: markdownToHtml(rest) });
  }
  return sections;
}

// Minimal markdown-to-HTML converter for the subset used in content files.
// Handles: paragraphs, bold, italic, links, blockquotes, lists.
function markdownToHtml(md: string): string {
  const paras = md.split(/\n{2,}/);
  return paras.map(p => {
    p = p.trim();
    if (!p) return '';
    // Blockquote
    if (p.startsWith('> ')) {
      const inner = p.replace(/^> /gm, '');
      return `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2">${inline(inner)}</blockquote>`;
    }
    // Unordered list
    if (/^\s*[-*] /.test(p)) {
      const items = p.split('\n').filter(l => /^\s*[-*] /.test(l));
      return `<ul class="list-disc list-inside space-y-1">${items.map(li => `<li>${inline(li.replace(/^\s*[-*] /, ''))}</li>`).join('')}</ul>`;
    }
    // Ordered list
    if (/^\s*\d+\. /.test(p)) {
      const items = p.split('\n').filter(l => /^\s*\d+\. /.test(l));
      return `<ol class="list-decimal list-inside space-y-1">${items.map(li => `<li>${inline(li.replace(/^\s*\d+\. /, ''))}</li>`).join('')}</ol>`;
    }
    // h3
    if (p.startsWith('### ')) return `<h3 class="font-semibold text-gray-700 mt-3 mb-1">${inline(p.slice(4))}</h3>`;
    // h4
    if (p.startsWith('#### ')) return `<h4 class="font-semibold text-gray-600 mt-2 mb-1 text-sm">${inline(p.slice(5))}</h4>`;
    // Regular paragraph
    return `<p>${inline(p)}</p>`;
  }).filter(Boolean).join('\n');
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
}
