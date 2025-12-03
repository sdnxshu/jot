"use client"

import { useState, useCallback, useRef } from "react"
import { Sidebar } from "./sidebar"
import { Editor } from "./editor"
import { Preview } from "./preview"
import { Toolbar } from "./toolbar"
import { exportToPdf } from "@/lib/export-pdf"
import type { Note } from "@/lib/types"

const defaultContent = `# Welcome to Inkwell

A sleek, distraction-free markdown note-taking app.

## Features

- **Live Preview** - See your markdown rendered in real-time
- **Clean Interface** - Focus on what matters: your words
- **Keyboard Shortcuts** - Write faster with intuitive shortcuts

## Getting Started

Start typing in the editor on the left. Your formatted preview appears on the right.

### Markdown Basics

Here's what you can do:

- Create **bold** and *italic* text
- Add \`inline code\` and code blocks
- Create [links](https://example.com)
- Build lists and checklists

> "The first draft is just you telling yourself the story." — Terry Pratchett

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

---

Happy writing! ✨
`

export function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome to Inkwell",
      content: defaultContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [activeNoteId, setActiveNoteId] = useState<string>("1")
  const [showPreview, setShowPreview] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [scrollSource, setScrollSource] = useState<"editor" | "preview" | null>(null)
  const scrollSourceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0]

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          const title = content.split("\n")[0]?.replace(/^#*\s*/, "") || "Untitled"
          return { ...note, content, title, updatedAt: new Date() }
        }
        return note
      }),
    )
  }, [])

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled",
      content: "# Untitled\n\nStart writing...",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveNoteId(newNote.id)
  }, [])

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const filtered = prev.filter((n) => n.id !== id)
        if (filtered.length === 0) {
          const newNote: Note = {
            id: Date.now().toString(),
            title: "Untitled",
            content: "# Untitled\n\nStart writing...",
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setActiveNoteId(newNote.id)
          return [newNote]
        }
        if (id === activeNoteId) {
          setActiveNoteId(filtered[0].id)
        }
        return filtered
      })
    },
    [activeNoteId],
  )

  const handleExportPdf = useCallback(() => {
    if (activeNote) {
      exportToPdf(activeNote.content, activeNote.title)
    }
  }, [activeNote])

  const handleEditorScrollStart = useCallback(() => {
    if (scrollSourceTimeoutRef.current) {
      clearTimeout(scrollSourceTimeoutRef.current)
    }
    setScrollSource("editor")
    scrollSourceTimeoutRef.current = setTimeout(() => {
      setScrollSource(null)
    }, 150)
  }, [])

  const handlePreviewScrollStart = useCallback(() => {
    if (scrollSourceTimeoutRef.current) {
      clearTimeout(scrollSourceTimeoutRef.current)
    }
    setScrollSource("preview")
    scrollSourceTimeoutRef.current = setTimeout(() => {
      setScrollSource(null)
    }, 150)
  }, [])

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onExportPdf={handleExportPdf}
        />
        <div className="flex-1 flex min-h-0">
          <Editor
            content={activeNote?.content || ""}
            onChange={(content) => updateNote(activeNote.id, content)}
            showPreview={showPreview}
            onScroll={setScrollPercentage}
            scrollPercentage={scrollPercentage}
            isScrollSource={scrollSource === "editor"}
            onScrollStart={handleEditorScrollStart}
          />
          {showPreview && (
            <Preview
              content={activeNote?.content || ""}
              onScroll={setScrollPercentage}
              scrollPercentage={scrollPercentage}
              isScrollSource={scrollSource === "preview"}
              onScrollStart={handlePreviewScrollStart}
            />
          )}
        </div>
      </div>
    </div>
  )
}
