"use client"

import React, { useState, useCallback } from "react"

import { Sidebar } from "@/app/(root)/_components/sidebar"
import { Editor } from "@/app/(root)/_components/editor"
import { Preview } from "@/app/(root)/_components/preview"
import { Toolbar } from "@/app/(root)/_components/toolbar"

import { exportToPdf } from "@/utils/export-pdf"

import type { Note } from "@/types"

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

const Page = () => {
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
                        onScrollStart={() => setScrollSource("editor")}
                    />
                    {showPreview && (
                        <Preview
                            content={activeNote?.content || ""}
                            onScroll={setScrollPercentage}
                            scrollPercentage={scrollPercentage}
                            isScrollSource={scrollSource === "preview"}
                            onScrollStart={() => setScrollSource("preview")}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page