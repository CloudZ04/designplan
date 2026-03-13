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

      <div className="grid grid-cols-3 gap-6">

        {/* CREATE NEW TILE */}

        <div className="border rounded-xl p-4 bg-gray-800">

          <h2 className="font-semibold mb-2">
            Create New
          </h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <button
            onClick={createPlan}
            className="bg-black text-white px-3 py-2 rounded w-full"
          >
            Create
          </button>

        </div>

        {/* PLAN TILES */}

        {plans.map((plan:any)=>(
          <a key={plan.id} href={`/plan/${plan.id}`}>

            <div className="border rounded-xl p-4 hover:shadow transition">

              <h3 className="font-semibold text-lg">
                {plan.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {plan.description}
              </p>

            </div>

          </a>
        ))}

      </div>

    </main>

  )
}