"use client"

import React from 'react'
import { Eye, EyeOff, PanelLeftClose, PanelLeft, Download } from "lucide-react"

import { Button } from "@/components/ui/button"

type Props = {
    showPreview: boolean
    onTogglePreview: () => void
    sidebarOpen: boolean
    onToggleSidebar: () => void
    onExportPdf: () => void
}

const Toolbar = ({
    showPreview,
    onTogglePreview,
    sidebarOpen,
    onToggleSidebar,
    onExportPdf
}: Props) => {
    return (
        <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onToggleSidebar}
                >
                    {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={onExportPdf}
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={onTogglePreview}
                >
                    {showPreview ? (
                        <>
                            <EyeOff className="h-4 w-4" />
                            <span className="hidden sm:inline">Hide Preview</span>
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Show Preview</span>
                        </>
                    )}
                </Button>
            </div>
        </header>
    )
}

export { Toolbar }