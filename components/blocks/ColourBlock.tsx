"use client"

import { useState, useCallback } from "react"

const COLOURS_PER_ROW = 3
const DEFAULT_HEX = "#888888"

function parseBlockData(block: { data?: unknown }) {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  const colors: string[] = Array.isArray(data.colors) ? data.colors : []
  return { colors }
}

function isValidHex(s: string) {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(s)
}

function normalizeHex(s: string): string {
  const t = s.trim().replace(/^#/, "")
  if (/^[0-9A-Fa-f]{3}$/.test(t)) {
    return "#" + t[0] + t[0] + t[1] + t[1] + t[2] + t[2]
  }
  if (/^[0-9A-Fa-f]{6}$/.test(t)) return "#" + t
  return DEFAULT_HEX
}

interface ColourBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: { colors: string[] }) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

export default function ColourBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: ColourBlockProps) {
  const { colors: initialColors } = parseBlockData(block)
  const [colors, setColors] = useState<string[]>(
    initialColors.length > 0 ? initialColors : []
  )

  const persist = useCallback(
    async (next: string[]) => {
      setColors(next)
      await onUpdate({ colors: next })
    },
    [onUpdate]
  )

  const addTile = () => {
    persist([...colors, DEFAULT_HEX])
  }

  const setTile = (index: number, value: string) => {
    const next = [...colors]
    next[index] = value
    setColors(next)
  }

  const setTileAndPersist = (index: number, value: string) => {
    const next = [...colors]
    next[index] = value
    persist(next)
  }

  const removeTile = (index: number) => {
    const next = colors.filter((_, i) => i !== index)
    persist(next)
  }

  return (
    <div
      className="bg-gray-800/95 border border-gray-600 rounded-lg overflow-hidden select-none flex flex-col"
      style={{
        width: block.width ?? 220,
        minHeight: block.height ?? 120
      }}
    >
      <div
        draggable={!disableDrag}
        onDragStart={onDragStart}
        className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-600 shrink-0 ${disableDrag ? "cursor-pointer" : "cursor-move"}`}
      >
        <span className="text-sm font-medium text-gray-200">
          Colour block
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            addTile()
          }}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer"
        >
          + Add colour
        </button>
      </div>

      <div
        className="p-2 grid gap-2 flex-1"
        style={{ gridTemplateColumns: `repeat(${COLOURS_PER_ROW}, minmax(0, 1fr))` }}
      >
        {colors.map((hex, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square max-w-[52px] rounded border border-gray-600 overflow-hidden bg-gray-900">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: isValidHex(hex) ? hex : "#333"
                }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setTile(i, e.target.value)}
                onBlur={(e) => setTileAndPersist(i, normalizeHex(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur()
                  }
                }}
                placeholder="#"
                className="absolute inset-0 w-full h-full text-[10px] font-mono text-center bg-transparent text-white/90 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeTile(i)}
              className="text-[10px] text-gray-400 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
