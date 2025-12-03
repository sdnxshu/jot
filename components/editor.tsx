"use client"

import type React from "react"

import { useRef, useEffect, useCallback } from "react"
import { cn } from "@/utils/cn"

interface EditorProps {
  content: string
  onChange: (content: string) => void
  showPreview: boolean
  onScroll: (scrollPercentage: number) => void
  scrollPercentage: number
  isScrollSource: boolean
  onScrollStart: () => void
}

export function Editor({
  content,
  onChange,
  showPreview,
  onScroll,
  scrollPercentage,
  isScrollSource,
  onScrollStart,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (!isScrollSource && textareaRef.current) {
      const textarea = textareaRef.current
      const maxScroll = textarea.scrollHeight - textarea.clientHeight
      const targetScroll = maxScroll * scrollPercentage

      isProgrammaticScroll.current = true
      textarea.scrollTop = targetScroll

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 50)
    }
  }, [scrollPercentage, isScrollSource])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (isProgrammaticScroll.current) return

      const textarea = e.currentTarget
      const maxScroll = textarea.scrollHeight - textarea.clientHeight
      if (maxScroll > 0) {
        onScrollStart()
        onScroll(textarea.scrollTop / maxScroll)
      }
    },
    [onScroll, onScrollStart],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newContent = content.substring(0, start) + "  " + content.substring(end)
      onChange(newContent)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className={cn("flex-1 flex flex-col min-w-0 border-r border-border", showPreview ? "lg:w-1/2" : "w-full")}>
      <div className="px-4 py-2 border-b border-border bg-card">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Markdown</span>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        className="flex-1 w-full p-6 bg-background text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground"
        placeholder="Start writing..."
        spellCheck={false}
      />
    </div>
  )
}
