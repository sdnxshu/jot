export function exportToPdf(content: string, title: string) {
    const html = parseMarkdownForPdf(content)

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
        alert("Please allow popups to export PDF")
        return
    }

    const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
      }
      h1 { font-size: 2em; font-weight: 700; margin-bottom: 0.5em; margin-top: 1em; }
      h2 { font-size: 1.5em; font-weight: 600; margin-bottom: 0.5em; margin-top: 1em; }
      h3 { font-size: 1.25em; font-weight: 600; margin-bottom: 0.5em; margin-top: 1em; }
      p { margin-bottom: 1em; }
      strong { font-weight: 600; }
      em { font-style: italic; }
      code {
        background: #f4f4f5;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        font-size: 0.9em;
      }
      pre {
        background: #f4f4f5;
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 1em;
      }
      pre code {
        background: none;
        padding: 0;
      }
      blockquote {
        border-left: 4px solid #d4d4d8;
        padding-left: 1em;
        margin: 1em 0;
        color: #52525b;
        font-style: italic;
      }
      ul, ol {
        margin-bottom: 1em;
        padding-left: 2em;
      }
      li { margin-bottom: 0.25em; }
      hr {
        border: none;
        border-top: 1px solid #e4e4e7;
        margin: 2em 0;
      }
      a { color: #2563eb; text-decoration: underline; }
      @media print {
        body { padding: 20px; }
      }
    </style>
  `

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${styles}
      </head>
      <body>
        ${html}
      </body>
    </html>
  `)
    printWindow.document.close()

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
        printWindow.print()
    }
}

function parseMarkdownForPdf(markdown: string): string {
    let html = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang || "text"}">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Headers
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>")
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>")
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>")

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Links
    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2">$1</a>')

    // Blockquotes
    html = html.replace(/^&gt; (.*$)/gm, "<blockquote>$1</blockquote>")

    // Horizontal rule
    html = html.replace(/^---$/gm, "<hr>")

    // Unordered lists
    html = html.replace(/^- (.*$)/gm, "<li>$1</li>")
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

    // Paragraphs
    html = html
        .split("\n\n")
        .map((block) => {
            block = block.trim()
            if (
                !block ||
                block.startsWith("<h") ||
                block.startsWith("<ul") ||
                block.startsWith("<ol") ||
                block.startsWith("<pre") ||
                block.startsWith("<blockquote") ||
                block.startsWith("<hr")
            ) {
                return block
            }
            if (!block.startsWith("<")) {
                return `<p>${block.replace(/\n/g, "<br>")}</p>`
            }
            return block
        })
        .join("\n")

    return html
}
