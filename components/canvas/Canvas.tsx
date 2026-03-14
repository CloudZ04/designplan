"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import Sidebar from "@/components/sidebar/Sidebar"
import ColourBlock from "@/components/blocks/ColourBlock"
import "@/styles/globals.css"

const GRID_SIZE = 40
const GRID_STEP = GRID_SIZE / 2 // allow snapping at half-grid points
const SNAP_THRESHOLD = 10 // px
const MIN_BLOCK_SIZE = 80

function snapToGrid(value: number) {
  return Math.round(value / GRID_STEP) * GRID_STEP
}

function clampSize(value: number) {
  const snapped = snapToGrid(value)
  return Math.max(MIN_BLOCK_SIZE, snapped)
}

function nearestSnap(value: number, targets: number[]) {
  let best = value
  let bestDist = Infinity
  for (const t of targets) {
    const d = Math.abs(value - t)
    if (d < bestDist) {
      bestDist = d
      best = t
    }
  }
  return bestDist <= SNAP_THRESHOLD ? best : null
}

type ResizeEdge = "e" | "s" | "se"

export default function Canvas({ plan, blocks }: any) {
  const [canvasBlocks, setCanvasBlocks] = useState(blocks || [])
  const [planUpdatedAt, setPlanUpdatedAt] = useState<string | null>(
    plan?.updated_at ?? null
  )
  const [resizing, setResizing] = useState<{
    blockId: string
    edge: ResizeEdge
    startX: number
    startY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const resizeCurrentRef = useRef({ width: 0, height: 0 })

  async function handleDrop(e: any) {
    e.preventDefault()
    if (!plan) return

    const existingBlockId = e.dataTransfer.getData("application/x-block-id")
    const blockType =
      e.dataTransfer.getData("application/x-block-type") || "colour"

    const width = Number(e.dataTransfer.getData("application/x-block-width")) || 220
    const height =
      Number(e.dataTransfer.getData("application/x-block-height")) || 140
    const hotspotX =
      Number(e.dataTransfer.getData("application/x-drag-hotspot-x")) || 0
    const hotspotY =
      Number(e.dataTransfer.getData("application/x-drag-hotspot-y")) || 0

    const rect = e.currentTarget.getBoundingClientRect()
    // Cursor is positioned at the drag image “hotspot”.
    const rawX = e.clientX - rect.left - hotspotX
    const rawY = e.clientY - rect.top - hotspotY

    // First pass: grid snap.
    let position_x = snapToGrid(rawX)
    let position_y = snapToGrid(rawY)

    // Second pass: snap to nearby block edges/centers (Figma-ish).
    const otherBlocks = (canvasBlocks as any[]).filter(
      (b) => !existingBlockId || b.id !== existingBlockId
    )
    if (otherBlocks.length) {
      const xTargets: number[] = []
      const yTargets: number[] = []

      for (const b of otherBlocks) {
        const bw = b.width || 220
        const bh = b.height || 140
        const left = b.position_x
        const top = b.position_y
        const right = left + bw
        const bottom = top + bh
        const cx = left + bw / 2
        const cy = top + bh / 2

        // Align our left/right/center to their left/right/center.
        xTargets.push(left) // left-to-left
        xTargets.push(right - width) // right-to-right
        xTargets.push(cx - width / 2) // center-to-center

        yTargets.push(top) // top-to-top
        yTargets.push(bottom - height) // bottom-to-bottom
        yTargets.push(cy - height / 2) // center-to-center
      }

      const snappedX = nearestSnap(position_x, xTargets)
      const snappedY = nearestSnap(position_y, yTargets)
      if (snappedX !== null) position_x = snappedX
      if (snappedY !== null) position_y = snappedY
    }

    if (existingBlockId) {
      // Move existing block.
      const res = await fetch(`/api/blocks/${existingBlockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position_x,
          position_y
        })
      })

      if (!res.ok) {
        console.error("Failed to move block:", await res.text())
        return
      }

      const updated = await res.json()
      setCanvasBlocks((prev: any[]) =>
        prev.map((b) => (b.id === existingBlockId ? updated : b))
      )
      setPlanUpdatedAt(new Date().toISOString())
    } else {
      // Create new block from palette.
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan.id,
          type: blockType,
          position_x,
          position_y,
          width,
          height
        })
      })

      if (!res.ok) {
        console.error("Failed to create block:", await res.text())
        return
      }

      const newBlock = await res.json()
      setCanvasBlocks((prev: any) => [...prev, newBlock])
      setPlanUpdatedAt(new Date().toISOString())
    }
  }

  function handleDragOver(e: any) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const updateBlockData = useCallback(
    async (blockId: string, data: { colors?: string[] }) => {
      const res = await fetch(`/api/blocks/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      if (!res.ok) return
      const updated = await res.json()
      setCanvasBlocks((prev: any[]) =>
        prev.map((b) => (b.id === blockId ? updated : b))
      )
      setPlanUpdatedAt(new Date().toISOString())
    },
    []
  )

  const startResize = useCallback(
    (e: React.MouseEvent, blockId: string, edge: ResizeEdge) => {
      e.stopPropagation()
      e.preventDefault()
      const block = (canvasBlocks as any[]).find((b: any) => b.id === blockId)
      const bw = block?.width ?? 220
      const bh = block?.height ?? 120
      resizeCurrentRef.current = { width: bw, height: bh }
      setResizing({
        blockId,
        edge,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: bw,
        startHeight: bh
      })
    },
    [canvasBlocks]
  )

  const updateBlockSize = useCallback(
    async (blockId: string, width: number, height: number) => {
      const res = await fetch(`/api/blocks/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ width, height })
      })
      if (!res.ok) return
      const updated = await res.json()
      setCanvasBlocks((prev: any[]) =>
        prev.map((b) => (b.id === blockId ? updated : b))
      )
      setPlanUpdatedAt(new Date().toISOString())
    },
    []
  )

  useEffect(() => {
    if (!resizing) return

    const onMove = (e: MouseEvent) => {
      const { blockId, edge, startX, startY, startWidth, startHeight } =
        resizing
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      let newWidth = startWidth
      let newHeight = startHeight
      if (edge === "e" || edge === "se") newWidth = startWidth + deltaX
      if (edge === "s" || edge === "se") newHeight = startHeight + deltaY
      newWidth = clampSize(newWidth)
      newHeight = clampSize(newHeight)

      resizeCurrentRef.current = { width: newWidth, height: newHeight }
      setCanvasBlocks((prev: any[]) =>
        prev.map((b) =>
          b.id === blockId ? { ...b, width: newWidth, height: newHeight } : b
        )
      )
    }

    const onUp = async () => {
      if (!resizing) return
      const { width, height } = resizeCurrentRef.current
      const w = width > 0 ? width : resizing.startWidth
      const h = height > 0 ? height : resizing.startHeight
      await updateBlockSize(resizing.blockId, w, h)
      setResizing(null)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [resizing, updateBlockSize])

  return (
    <div className="flex flex-1">

      {/* Sidebar */}
      {plan && (
        <Sidebar />
      )}

      {/* Canvas area */}
      <div className="flex-1 p-6 min-h-screen">

        <div className="flex text-xl font-semibold mb-4 border rounded-lg p-2 px-4 gap-4">
          <h2 className="flex items-center gap-2 flex-1">
            {plan?.title || "Untitled"}
          </h2>

          <span className="badge">
            <span className="badge-label">Created</span>
            <span className="badge-value">
              {new Date(plan.created_at).toLocaleDateString("en-GB")}
            </span>
          </span>

          <span className="badge">
            <span className="badge-label">Updated</span>
            <span className="badge-value">
              {new Date(planUpdatedAt ?? plan.updated_at).toLocaleTimeString()}
            </span>
          </span>
        </div>

        <div
          className="border rounded-lg min-h-[calc(100vh-110px)] relative canvas-grid"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >

          {canvasBlocks.map((block: any) => {
            const bw = block.width || 220
            const bh = block.height || 120

            const handleBlockDragStart = (ev: any) => {
              ev.dataTransfer.setData("application/x-block-id", block.id)
              ev.dataTransfer.setData(
                "application/x-block-type",
                block.type || "colour"
              )
              ev.dataTransfer.setData(
                "application/x-block-width",
                String(bw)
              )
              ev.dataTransfer.setData(
                "application/x-block-height",
                String(bh)
              )

              // Hotspot relative to block top-left (slightly inset).
              const hotspotX = Math.min(40, bw / 4)
              const hotspotY = Math.min(30, bh / 4)
              ev.dataTransfer.setData(
                "application/x-drag-hotspot-x",
                String(hotspotX)
              )
              ev.dataTransfer.setData(
                "application/x-drag-hotspot-y",
                String(hotspotY)
              )

              const ghost = document.createElement("div")
              ghost.style.width = `${bw}px`
              ghost.style.height = `${bh}px`
              ghost.style.borderRadius = "8px"
              ghost.style.border = "1px solid rgba(255,255,255,0.35)"
              ghost.style.background = "rgba(30,41,59,0.75)"
              ghost.style.boxSizing = "border-box"
              ghost.style.position = "fixed"
              ghost.style.left = "-9999px"
              ghost.style.top = "-9999px"
              document.body.appendChild(ghost)

              ev.dataTransfer.setDragImage(ghost, hotspotX, hotspotY)

              const cleanup = () => {
                try {
                  document.body.removeChild(ghost)
                } catch {}
                ev.currentTarget?.removeEventListener?.("dragend", cleanup)
              }
              ev.currentTarget?.addEventListener?.("dragend", cleanup)
            }

            return (
              <div
                key={block.id}
                style={{
                  position: "absolute",
                  left: block.position_x,
                  top: block.position_y
                }}
                className="block-wrapper"
              >
                <div
                  style={{ width: bw, height: bh }}
                  className="relative rounded-lg overflow-visible"
                >
                  {block.type === "colour" ? (
                    <ColourBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                    />
                  ) : (
                    <div
                      draggable
                      onDragStart={handleBlockDragStart}
                      style={{ width: bw, height: bh }}
                      className="bg-gray-800 border rounded-lg p-3 text-sm cursor-move select-none"
                    >
                      {block.type}
                    </div>
                  )}
                  {/* Resize handles - only when not resizing this block */}
                  {resizing?.blockId !== block.id && (
                    <>
                      <div
                        role="presentation"
                        onMouseDown={(e) => startResize(e, block.id, "e")}
                        className="resize-handle resize-handle-e"
                        title="Resize width"
                      />
                      <div
                        role="presentation"
                        onMouseDown={(e) => startResize(e, block.id, "s")}
                        className="resize-handle resize-handle-s"
                        title="Resize height"
                      />
                      <div
                        role="presentation"
                        onMouseDown={(e) => startResize(e, block.id, "se")}
                        className="resize-handle resize-handle-se"
                        title="Resize"
                      />
                    </>
                  )}
                </div>
              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}
