"use client"

import { type ReactNode } from "react"
import { SimpleNavigation } from "@/components/simple-navigation"

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <SimpleNavigation />
      <main className="pb-20 md:pb-0 md:ml-64">
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 