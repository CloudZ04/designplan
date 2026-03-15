"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import Sidebar from "@/components/sidebar/Sidebar"
import ColourBlock from "@/components/blocks/ColourBlock"
import TypographyBlock from "@/components/blocks/TypographyBlock"
import TechStackBlock from "@/components/blocks/TechStackBlock"
import SoftwareStackBlock from "@/components/blocks/SoftwareStackBlock"
import LinksBlock from "@/components/blocks/LinksBlock"
import DeadlineBlock from "@/components/blocks/DeadlineBlock"
import NotesBlock from "@/components/blocks/NotesBlock"
import "@/styles/globals.css"

const GRID_SIZE = 40
const GRID_STEP = GRID_SIZE / 2 // allow snapping at half-grid points
const SNAP_THRESHOLD = 10 // px
const MIN_BLOCK_SIZE = 80
const MIN_ZOOM = 0.4
const MAX_ZOOM = 2

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
type ActiveTool = "select" | "delete"

export default function Canvas({ plan, blocks }: any) {
  const [canvasBlocks, setCanvasBlocks] = useState(blocks || [])
  const [planUpdatedAt, setPlanUpdatedAt] = useState<string | null>(
    plan?.updated_at ?? null
  )
  const [activeTool, setActiveTool] = useState<ActiveTool>("select")
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [resizing, setResizing] = useState<{
    blockId: string
    edge: ResizeEdge
    startX: number
    startY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const resizeCurrentRef = useRef({ width: 0, height: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const panOriginRef = useRef({ x: 0, y: 0 })

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
    const visualX = e.clientX - rect.left - hotspotX
    const visualY = e.clientY - rect.top - hotspotY

    // Convert from screen space into canvas world space (pan + zoom aware).
    const rawX = (visualX - offset.x) / zoom
    const rawY = (visualY - offset.y) / zoom

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

  function handleCanvasMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    // Only start panning when clicking on empty canvas (not on a block).
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest(".block-wrapper")) return
    e.preventDefault()
    panStartRef.current = { x: e.clientX, y: e.clientY }
    panOriginRef.current = { ...offset }
    setIsPanning(true)
  }

  function handleCanvasWheel(e: React.WheelEvent<HTMLDivElement>) {
    // Plain wheel over the canvas zooms instead of scrolling the page.
    e.preventDefault()

    const delta = -e.deltaY
    const factor = delta > 0 ? 1.1 : 0.9
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor))
    if (nextZoom === zoom) return

    const rect = e.currentTarget.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    // Keep the point under the cursor stable while zooming.
    const worldXBefore = (cursorX - offset.x) / zoom
    const worldYBefore = (cursorY - offset.y) / zoom
    const nextOffsetX = cursorX - worldXBefore * nextZoom
    const nextOffsetY = cursorY - worldYBefore * nextZoom

    setZoom(nextZoom)
    setOffset({ x: nextOffsetX, y: nextOffsetY })
  }

  const updateBlockData = useCallback(
    async (blockId: string, data: any) => {
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

  const handleDeleteBlock = useCallback(
    async (blockId: string) => {
      const res = await fetch(`/api/blocks/${blockId}`, { method: "DELETE" })
      if (!res.ok) return
      setCanvasBlocks((prev: any[]) => prev.filter((b) => b.id !== blockId))
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

  useEffect(() => {
    if (!isPanning) return

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - panStartRef.current.x
      const dy = e.clientY - panStartRef.current.y
      setOffset({
        x: panOriginRef.current.x + dx,
        y: panOriginRef.current.y + dy
      })
    }

    const onUp = () => {
      setIsPanning(false)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [isPanning])

  return (
    <div className="flex flex-1 h-screen overflow-hidden">

      {/* Sidebar */}
      {plan && (
        <Sidebar />
      )}

      {/* Canvas area */}
      <div className="flex-1 p-6 overflow-hidden">

        <div className="flex items-center text-xl font-semibold mb-4 border rounded-lg p-2 px-4 gap-4">
          <h2 className="flex items-center gap-2 flex-1 min-w-0 truncate">
            {plan?.title || "Untitled"}
          </h2>

          {/* Middle: tools */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveTool((t) => (t === "delete" ? "select" : "delete"))
              }
              className={`p-2 rounded cursor-pointer transition-colors ${
                activeTool === "delete"
                  ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/50 hover:bg-red-500/30"
                  : "bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-500/50"
              }`}
              title={
                activeTool === "delete"
                  ? "Delete mode (click a block)"
                  : "Delete block"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>

            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() =>
                  setZoom((z) =>
                    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * 0.9))
                  )
                }
                className="px-2 py-1 text-xs rounded bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 cursor-pointer"
              >
                −
              </button>
              <span className="text-xs text-gray-400 min-w-[44px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setZoom((z) =>
                    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * 1.1))
                  )
                }
                className="px-2 py-1 text-xs rounded bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 cursor-pointer"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1)
                  setOffset({ x: 0, y: 0 })
                }}
                className="px-2 py-1 text-xs rounded bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <span className="badge shrink-0">
            <span className="badge-label">Created</span>
            <span className="badge-value">
              {new Date(plan.created_at).toLocaleDateString("en-GB")}
            </span>
          </span>

          <span className="badge shrink-0">
            <span className="badge-label">Updated</span>
            <span className="badge-value">
              {new Date(planUpdatedAt ?? plan.updated_at).toLocaleTimeString()}
            </span>
          </span>
        </div>

        <div
          className="border rounded-lg min-h-[calc(100vh-110px)] relative canvas-grid overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={handleCanvasMouseDown}
          onWheel={handleCanvasWheel}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: "0 0"
            }}
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

            const isDeleteMode = activeTool === "delete"

            return (
              <div
                key={block.id}
                style={{
                  position: "absolute",
                  left: block.position_x,
                  top: block.position_y
                }}
                className={`block-wrapper ${isDeleteMode ? "cursor-pointer" : ""}`}
                onClick={
                  isDeleteMode
                    ? (e) => {
                        const target = e.target as HTMLElement
                        if (target.closest("button, input, [contenteditable]"))
                          return
                        e.stopPropagation()
                        handleDeleteBlock(block.id)
                      }
                    : undefined
                }
                role={isDeleteMode ? "button" : undefined}
                title={isDeleteMode ? "Click to delete block" : undefined}
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
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "typography" ? (
                    <TypographyBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "techstack" ? (
                    <TechStackBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "softwarestack" ? (
                    <SoftwareStackBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "links" ? (
                    <LinksBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "deadline" ? (
                    <DeadlineBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : block.type === "notes" ? (
                    <NotesBlock
                      block={block}
                      onUpdate={(data) => updateBlockData(block.id, data)}
                      onDragStart={handleBlockDragStart}
                      disableDrag={isDeleteMode}
                    />
                  ) : (
                    <div
                      draggable={!isDeleteMode}
                      onDragStart={handleBlockDragStart}
                      style={{ width: bw, height: bh }}
                      className={`bg-gray-800 border rounded-lg p-3 text-sm select-none ${isDeleteMode ? "cursor-pointer" : "cursor-move"}`}
                    >
                      {block.type}
                    </div>
                  )}
                  {/* Resize handles - only when not resizing and not in delete mode */}
                  {resizing?.blockId !== block.id && !isDeleteMode && (
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

    </div>
  )
}
