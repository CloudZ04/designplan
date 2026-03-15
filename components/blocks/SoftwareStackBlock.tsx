"use client"

import { useState, useCallback } from "react"
import { resolveSoftwareIcon } from "@/lib/softwareIcons"

interface SoftwareItem {
  name: string
}

interface SoftwareStackData {
  items: SoftwareItem[]
}

function parseBlockData(block: { data?: unknown }): SoftwareStackData {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  const items = Array.isArray(data.items)
    ? data.items.map((t: any) => ({ name: String(t?.name ?? "") }))
    : []
  return { items }
}

interface SoftwareStackBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: SoftwareStackData) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

export default function SoftwareStackBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: SoftwareStackBlockProps) {
  const initial = parseBlockData(block)
  const [items, setItems] = useState<SoftwareItem[]>(
    initial.items.length > 0 ? initial.items : [{ name: "" }]
  )

  const persist = useCallback(
    async (next: SoftwareItem[]) => {
      setItems(next)
      await onUpdate({ items: next })
    },
    [onUpdate]
  )

  const setName = (index: number, name: string) => {
    const next = [...items]
    next[index] = { name }
    setItems(next)
  }

  const setNameAndPersist = (index: number, name: string) => {
    const next = [...items]
    next[index] = { name }
    persist(next)
  }

  const addItem = () => {
    persist([...items, { name: "" }])
  }

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index)
    persist(next.length ? next : [{ name: "" }])
  }

  return (
    <div
      className="bg-gray-800/95 border border-gray-600 rounded-lg overflow-hidden select-none flex flex-col"
      style={{
        width: block.width ?? 260,
        minHeight: block.height ?? 200
      }}
    >
      <div
        draggable={!disableDrag}
        onDragStart={onDragStart}
        className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-600 shrink-0 ${
          disableDrag ? "cursor-pointer" : "cursor-move"
        }`}
      >
        <span className="text-sm font-medium text-gray-200">
          Software / OS Stack
        </span>

        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            addItem()
          }}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer"
        >
          + Add Software
        </button>
      </div>

      <div
        className="p-3 flex-1 min-h-0 overflow-y-auto grid gap-3"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {items.map((t, index) => {
          const icon = t.name ? resolveSoftwareIcon(t.name) : null
          const initials =
            t.name
              .trim()
              .split(/\s+/)
              .map((part) => part[0]?.toUpperCase() || "")
              .join("")
              .slice(0, 2) || "?"

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-square max-w-[64px] rounded-sm flex items-center justify-center overflow-hidden">
                {icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={icon.iconUrl}
                    alt={icon.label}
                    className={`w-full h-full object-contain ${
                      icon.invertOnDark
                        ? "invert brightness-150"
                        : icon.brightenOnDark
                        ? "brightness-150"
                        : ""
                    }`}
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-300">
                    {initials}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={t.name}
                onChange={(e) => setName(index, e.target.value)}
                onBlur={(e) => setNameAndPersist(index, e.target.value)}
                placeholder="e.g. Windows, VS Code, Photoshop"
                className="w-full px-1.5 py-1 text-[11px] rounded bg-gray-900 border border-gray-700 text-gray-200 placeholder:text-gray-500 text-center focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-[10px] text-gray-400 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

