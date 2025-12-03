"use client"

import { Plus, FileText, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Note } from "@/lib/types"
import { cn } from "@/utils/cn"
import { formatDistanceToNow } from "date-fns"

interface SidebarProps {
  notes: Note[]
  activeNoteId: string
  onSelectNote: (id: string) => void
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden",
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">I</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Inkwell</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3">
          <Button
            onClick={onCreateNote}
            className="w-full justify-start gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "group relative rounded-lg transition-colors cursor-pointer",
                  activeNoteId === note.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50",
                )}
              >
                <button onClick={() => onSelectNote(note.id)} className="w-full p-3 text-left">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-sidebar-foreground truncate">{note.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </aside>
    </>
  )
}
