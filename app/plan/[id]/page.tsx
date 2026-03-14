import { getPlan } from "@/lib/queries/plans"
import { getBlocks } from "@/lib/queries/blocks"
import Canvas from "@/components/canvas/Canvas"
import "@/styles/globals.css"

export default async function PlanPage({ params }: any) {

    const { id } = await params

    const plan = await getPlan(id)
    const blocks = await getBlocks(id)

    return (
      <main className="background-gradient min-h-screen flex">
        <Canvas
          plan={plan}
          blocks={blocks}
        />
      </main>
    )
  }
