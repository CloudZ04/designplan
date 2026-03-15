"use client"

import { useState, useCallback } from "react"

interface NotesBlockData {
  content: string
}

function parseBlockData(block: { data?: unknown }): NotesBlockData {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  return {
    content: typeof data.content === "string" ? data.content : ""
  }
}

interface NotesBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: NotesBlockData) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

export default function NotesBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: NotesBlockProps) {
  const initial = parseBlockData(block)
  const [content, setContent] = useState(initial.content)

  const persist = useCallback(
    async (value: string) => {
      setContent(value)
      await onUpdate({ content: value })
    },
    [onUpdate]
  )

  return (
    <div
      className="bg-gray-800/95 border border-gray-600 rounded-lg overflow-hidden select-none flex flex-col"
      style={{
        width: block.width ?? 280,
        minHeight: block.height ?? 200
      }}
    >
      <div
        draggable={!disableDrag}
        onDragStart={onDragStart}
        className={`shrink-0 px-3 py-2 border-b border-gray-600 ${
          disableDrag ? "cursor-pointer" : "cursor-move"
        }`}
      >
        <span className="text-sm font-medium text-gray-200">Notes</span>
      </div>

      <div className="p-3 flex-1 min-h-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={(e) => persist(e.target.value)}
          placeholder="Project notes, to-dos, ideas..."
          className="flex-1 min-h-[120px] w-full px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
          style={{ minHeight: "120px" }}
        />
      </div>
    </div>
  )
}
