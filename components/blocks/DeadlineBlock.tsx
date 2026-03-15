"use client"

import { useState, useCallback } from "react"

interface DeadlineItem {
  label: string
  date: string
}

interface DeadlineBlockData {
  deadlines: DeadlineItem[]
}

function parseBlockData(block: { data?: unknown }): DeadlineBlockData {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  const deadlines = Array.isArray(data.deadlines)
    ? data.deadlines.map((d: any) => ({
        label: String(d?.label ?? ""),
        date: String(d?.date ?? "")
      }))
    : []
  return { deadlines }
}

function formatDisplayDate(iso: string): string {
  if (!iso.trim()) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

interface DeadlineBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: DeadlineBlockData) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

export default function DeadlineBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: DeadlineBlockProps) {
  const initial = parseBlockData(block)
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(
    initial.deadlines.length > 0
      ? initial.deadlines
      : [{ label: "", date: "" }]
  )

  const persist = useCallback(
    async (next: DeadlineItem[]) => {
      setDeadlines(next)
      await onUpdate({ deadlines: next })
    },
    [onUpdate]
  )

  const setItem = (
    index: number,
    field: "label" | "date",
    value: string
  ) => {
    const next = [...deadlines]
    next[index] = { ...next[index], [field]: value }
    setDeadlines(next)
  }

  const setItemAndPersist = (
    index: number,
    field: "label" | "date",
    value: string
  ) => {
    const next = [...deadlines]
    next[index] = { ...next[index], [field]: value }
    persist(next)
  }

  const addDeadline = () => {
    persist([...deadlines, { label: "", date: "" }])
  }

  const removeDeadline = (index: number) => {
    const next = deadlines.filter((_, i) => i !== index)
    persist(next.length ? next : [{ label: "", date: "" }])
  }

  return (
    <div
      className="bg-gray-800/95 border border-gray-600 rounded-lg overflow-hidden select-none flex flex-col"
      style={{
        width: block.width ?? 260,
        minHeight: block.height ?? 180
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
          Deadline
        </span>

        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            addDeadline()
          }}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer"
        >
          + Add deadline
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        {deadlines.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={item.label}
                onChange={(e) => setItem(index, "label", e.target.value)}
                onBlur={(e) =>
                  setItemAndPersist(index, "label", e.target.value)
                }
                placeholder="Label (e.g. Launch, Milestone)"
                className="flex-1 min-w-0 px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <button
                type="button"
                onClick={() => removeDeadline(index)}
                className="text-xs text-gray-400 hover:text-red-400 shrink-0"
              >
                Remove
              </button>
            </div>
            <input
              type="date"
              value={item.date}
              onChange={(e) => setItem(index, "date", e.target.value)}
              onBlur={(e) =>
                setItemAndPersist(index, "date", e.target.value)
              }
              className="w-full px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {item.date && (
              <span className="text-xs text-gray-400">
                {formatDisplayDate(item.date)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
