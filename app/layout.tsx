import React from 'react'
import type { Metadata, Viewport } from "next";

import { ThemeProvider } from '@/components/providers/theme';

import "./globals.css";

export const metadata: Metadata = {
    title: "Jot - Markdown Notes",
    description: "A sleek, distraction-free markdown note-taking app",
    generator: 'v0.app'
}

export const viewport: Viewport = {
    themeColor: "#1a1a1a",
}

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
