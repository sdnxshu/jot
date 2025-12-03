"use client"

import React, { useMemo, useRef, useEffect, useCallback } from "react"

type Props = {
    content: string
    onScroll: (scrollPercentage: number) => void
    scrollPercentage: number
    isScrollSource: boolean
    onScrollStart: () => void
}

const Preview = ({
    content,
    onScroll,
    scrollPercentage,
    isScrollSource,
    onScrollStart
}: Props) => {
    const html = useMemo(() => parseMarkdown(content), [content])
    const containerRef = useRef<HTMLDivElement>(null)
    const isInternalScroll = useRef(false)

    useEffect(() => {
        if (!isScrollSource && containerRef.current && !isInternalScroll.current) {
            const container = containerRef.current
            const maxScroll = container.scrollHeight - container.clientHeight
            container.scrollTop = maxScroll * scrollPercentage
        }
    }, [scrollPercentage, isScrollSource])

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const container = e.currentTarget
            const maxScroll = container.scrollHeight - container.clientHeight
            if (maxScroll > 0) {
                isInternalScroll.current = true
                onScrollStart()
                onScroll(container.scrollTop / maxScroll)
                setTimeout(() => {
                    isInternalScroll.current = false
                }, 50)
            }
        },
        [onScroll, onScrollStart],
    )

    return (
        <div className="flex-1 flex flex-col min-w-0 lg:w-1/2">
            <div className="px-4 py-2 border-b border-border bg-card">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
            </div>
            <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
                <div className="markdown-preview p-6 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    )
}

function parseMarkdown(markdown: string): string {
    let html = markdown
        // Escape HTML
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

    // Code blocks (must be before other processing)
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
    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

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

export { Preview }