import { marked } from "marked";
import TurndownService from "turndown";

// Configuración de marked para renderizar Markdown
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Configuración de Turndown para convertir HTML a Markdown
const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  fence: "```",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full",
});

// Regla para <span style="color:...">
turndownService.addRule("colorSpan", {
  filter: (node: Node): boolean =>
    node.nodeName === "SPAN" && (node as HTMLElement).style?.color !== null,
  replacement: (content: string, node: Node) => {
    const color = (node as HTMLElement).style.color;
    return `<span style="color:${color}">${content}</span>`;
  },
});

// Regla para párrafos
turndownService.addRule("paragraph", {
  filter: "p",
  replacement: (content: string) => `\n\n${content}\n\n`,
});

// Regla para saltos de línea <br>
turndownService.addRule("lineBreak", {
  filter: "br",
  replacement: () => "\n",
});

// Convertir Markdown a HTML
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown).toString();
}

// Convertir HTML a Markdown
export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}
