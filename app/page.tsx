"use client"
import "@/styles/globals.css"
import { useEffect, useState } from "react"

export default function Home() {

  const [plans,setPlans] = useState([])
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")

  async function loadPlans(){
    const res = await fetch("/api/plans")
    const data = await res.json()
    setPlans(data)
  }

  async function createPlan(){
    if(!title) return

    await fetch("/api/plans",{
      method:"POST",
      body:JSON.stringify({title,description})
    })

    setTitle("")
    setDescription("")
    loadPlans()
  }

  useEffect(()=>{
    loadPlans()
  },[])

  return (
    <main className="background-gradient p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Design Plans
      </h1>
  
      <div className="grid grid-cols-3 gap-6 items-stretch">
        {/* CREATE NEW TILE */}
        <div className="border rounded-xl p-4 bg-gray-800 flex flex-col h-[220px]">
          <h2 className="font-semibold mb-2">
            Create New
          </h2>
  
          <input
            className="border p-2 w-full mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
  
          <input
            className="border p-2 w-full mb-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
  
          <button
            onClick={createPlan}
            className="button bg-black text-white px-3 py-2 rounded w-full mt-auto cursor-pointer hover:bg-orange-800 font-semibold"
          >
            Create
          </button>
        </div>
  
        {/* PLAN TILES */}
        {plans.map((plan: any) => (
          <a key={plan.id} href={`/plan/${plan.id}`} className="h-full">
            <div className="border rounded-xl p-4 hover:shadow transition flex flex-col h-[220px]">
              <h3 className="font-semibold text-lg">
                {plan.title}
              </h3>
  
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {plan.description}
              </p>
  
              <div className="plan-meta mt-auto flex gap-2 flex-wrap">

              <span className="badge">
                <span className="badge-label">Created</span>
                <span className="badge-value">
                  {new Date(plan.created_at).toLocaleDateString("en-GB")}
                </span>
              </span>

              <span className="badge">
                <span className="badge-label">Updated</span>
                <span className="badge-value">
                  {new Date(plan.updated_at).toLocaleTimeString()}
                </span>
              </span>

              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}