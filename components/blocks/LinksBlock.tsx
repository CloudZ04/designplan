"use client"

import { useState, useCallback } from "react"

interface LinkItem {
  label: string
  url: string
}

interface LinksBlockData {
  links: LinkItem[]
}

function parseBlockData(block: { data?: unknown }): LinksBlockData {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  const links = Array.isArray(data.links)
    ? data.links.map((l: any) => ({
        label: String(l?.label ?? ""),
        url: String(l?.url ?? "")
      }))
    : []
  return { links }
}

interface LinksBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: LinksBlockData) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

export default function LinksBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: LinksBlockProps) {
  const initial = parseBlockData(block)
  const [links, setLinks] = useState<LinkItem[]>(
    initial.links.length > 0 ? initial.links : [{ label: "", url: "" }]
  )

  const persist = useCallback(
    async (next: LinkItem[]) => {
      setLinks(next)
      await onUpdate({ links: next })
    },
    [onUpdate]
  )

  const setLink = (index: number, field: "label" | "url", value: string) => {
    const next = [...links]
    next[index] = { ...next[index], [field]: value }
    setLinks(next)
  }

  const setLinkAndPersist = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    const next = [...links]
    next[index] = { ...next[index], [field]: value }
    persist(next)
  }

  const addLink = () => {
    persist([...links, { label: "", url: "" }])
  }

  const removeLink = (index: number) => {
    const next = links.filter((_, i) => i !== index)
    persist(next.length ? next : [{ label: "", url: "" }])
  }

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
        className={`flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-600 shrink-0 ${
          disableDrag ? "cursor-pointer" : "cursor-move"
        }`}
      >
        <span className="text-sm font-medium text-gray-200">
          URL / Links / CDNs
        </span>

        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            addLink()
          }}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer"
        >
          + Add link
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
        {links.map((link, index) => (
          <div
            key={index}
            className="flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={link.label}
                onChange={(e) => setLink(index, "label", e.target.value)}
                onBlur={(e) => setLinkAndPersist(index, "label", e.target.value)}
                placeholder="Label (e.g. Figma, CDN)"
                className="flex-1 min-w-0 px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="text-xs text-gray-400 hover:text-red-400 shrink-0"
              >
                Remove
              </button>
            </div>
            <input
              type="url"
              value={link.url}
              onChange={(e) => setLink(index, "url", e.target.value)}
              onBlur={(e) => setLinkAndPersist(index, "url", e.target.value)}
              placeholder="https://..."
              className="w-full px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {link.url.trim() && (
              <a
                href={link.url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline truncate"
              >
                Open link →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
