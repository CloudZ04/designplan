"use client"

import { useState, useCallback, useEffect } from "react"
import { loadGoogleFont, fontFamilyFromValue } from "@/lib/googleFonts"

export interface TypographyData {
  headings?: string
  body?: string
  alt?: string
  other?: string
}

function parseBlockData(block: { data?: unknown }): TypographyData {
  const raw = block.data
  const data = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}
  return {
    headings: typeof data.headings === "string" ? data.headings : "",
    body: typeof data.body === "string" ? data.body : "",
    alt: typeof data.alt === "string" ? data.alt : "",
    other: typeof data.other === "string" ? data.other : ""
  }
}

interface TypographyBlockProps {
  block: { id: string; width?: number; height?: number; data?: unknown }
  onUpdate: (data: TypographyData) => Promise<void>
  onDragStart: (e: React.DragEvent) => void
  disableDrag?: boolean
}

const FONT_FAMILY_KEYS: (keyof TypographyData)[] = ["headings", "body"]

const FIELDS: { key: keyof TypographyData; label: string; placeholder: string }[] = [
  { key: "headings", label: "Headings", placeholder: "e.g. Montserrat" },
  { key: "body", label: "Body", placeholder: "e.g. Inter" },
  { key: "alt", label: "Alt text", placeholder: "e.g. 14px, italic" },
  { key: "other", label: "Other", placeholder: "e.g. captions, labels" }
]

export default function TypographyBlock({
  block,
  onUpdate,
  onDragStart,
  disableDrag = false
}: TypographyBlockProps) {
  const initial = parseBlockData(block)
  const [values, setValues] = useState<TypographyData>(initial)

  const persist = useCallback(
    async (next: TypographyData) => {
      setValues(next)
      await onUpdate(next)
    },
    [onUpdate]
  )

  const setField = (key: keyof TypographyData, value: string) => {
    const next = { ...values, [key]: value }
    setValues(next)
  }

  const handleBlur = () => {
    persist(values)
  }

  useEffect(() => {
    FONT_FAMILY_KEYS.forEach((key) => {
      const raw = values[key]?.trim()
      if (raw) loadGoogleFont(raw)
    })
  }, [values.headings, values.body])

  return (
    <div
      className="bg-gray-800/95 border border-gray-600 rounded-lg overflow-hidden select-none flex flex-col"
      style={{
        width: block.width ?? 220,
        minHeight: block.height ?? 140
      }}
    >
      <div
        draggable={!disableDrag}
        onDragStart={onDragStart}
        className={`flex items-center gap-2 px-3 py-2 border-b border-gray-600 shrink-0 ${disableDrag ? "cursor-pointer" : "cursor-move"}`}
      >
        <span className="text-sm font-medium text-gray-200">
          Typography
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1 min-h-0">
        {FIELDS.map(({ key, label, placeholder }) => {
          const value = values[key] ?? ""
          const isFontField = FONT_FAMILY_KEYS.includes(key)
          return (
            <div key={key} className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setField(key, e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                style={
                  isFontField && value
                    ? {
                        fontFamily: `${fontFamilyFromValue(value)}, system-ui, sans-serif`
                      }
                    : undefined
                }
                className="w-full px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
