"use client"

const DEFAULT_BLOCK_WIDTH = 220
const DEFAULT_BLOCK_HEIGHT = 140
// Put the cursor a bit inside the block, like Figma.
const DEFAULT_HOTSPOT_X = 24
const DEFAULT_HOTSPOT_Y = 20

export default function Sidebar() {
  function handleDragStart(e: any, type: string) {
    e.dataTransfer.setData("application/x-block-type", type)
    e.dataTransfer.setData(
      "application/x-block-width",
      String(DEFAULT_BLOCK_WIDTH)
    )
    e.dataTransfer.setData(
      "application/x-block-height",
      String(DEFAULT_BLOCK_HEIGHT)
    )
    e.dataTransfer.setData("application/x-drag-hotspot-x", String(DEFAULT_HOTSPOT_X))
    e.dataTransfer.setData("application/x-drag-hotspot-y", String(DEFAULT_HOTSPOT_Y))
    e.dataTransfer.effectAllowed = "copy"

    // Create a drag “ghost” that matches the block size.
    const ghost = document.createElement("div")
    ghost.style.width = `${DEFAULT_BLOCK_WIDTH}px`
    ghost.style.height = `${DEFAULT_BLOCK_HEIGHT}px`
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

      {/* Later: typography, tech stack, URL, notes, logo, etc. */}
    </div>
  )
}

