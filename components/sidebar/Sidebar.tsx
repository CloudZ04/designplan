"use client"

const DEFAULT_HOTSPOT_X = 24
const DEFAULT_HOTSPOT_Y = 20

const BLOCK_DEFAULTS: Record<string, { width: number; height: number }> = {
  colour: { width: 220, height: 140 },
  typography: { width: 240, height: 300 }
}

function getBlockDefaults(type: string) {
  return BLOCK_DEFAULTS[type] ?? { width: 220, height: 140 }
}

export default function Sidebar() {
  function handleDragStart(e: any, type: string) {
    const { width, height } = getBlockDefaults(type)
    e.dataTransfer.setData("application/x-block-type", type)
    e.dataTransfer.setData("application/x-block-width", String(width))
    e.dataTransfer.setData("application/x-block-height", String(height))
    e.dataTransfer.setData("application/x-drag-hotspot-x", String(DEFAULT_HOTSPOT_X))
    e.dataTransfer.setData("application/x-drag-hotspot-y", String(DEFAULT_HOTSPOT_Y))
    e.dataTransfer.effectAllowed = "copy"

    // Create a drag “ghost” that matches the block size.
    const ghost = document.createElement("div")
    ghost.style.width = `${width}px`
    ghost.style.height = `${height}px`
    ghost.style.borderRadius = "8px"
    ghost.style.border = "1px solid rgba(255,255,255,0.35)"
    ghost.style.background = "rgba(30,41,59,0.75)"
    ghost.style.boxSizing = "border-box"
    ghost.style.position = "fixed"
    ghost.style.left = "-9999px"
    ghost.style.top = "-9999px"
    document.body.appendChild(ghost)

    // Align drop math with what the user sees while dragging.
    e.dataTransfer.setDragImage(ghost, DEFAULT_HOTSPOT_X, DEFAULT_HOTSPOT_Y)

    // Cleanup after drag ends.
    const cleanup = () => {
      try {
        document.body.removeChild(ghost)
      } catch {}
      e.currentTarget?.removeEventListener?.("dragend", cleanup)
    }
    e.currentTarget?.addEventListener?.("dragend", cleanup)
  }

  return (
    <div className="w-64 border-r p-4 shrink-0 space-y-3">
      <h2 className="text-sm font-semibold text-gray-400 tracking-wide">
        Blocks
      </h2>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "colour")}
        className="border rounded px-3 py-2 w-full bg-gray-900/60 hover:bg-gray-800 cursor-move text-sm"
      >
        Colour block
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "typography")}
        className="border rounded px-3 py-2 w-full bg-gray-900/60 hover:bg-gray-800 cursor-move text-sm"
      >
        Typography block
      </div>
    </div>
  )
}

