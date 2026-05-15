import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { healthLogSchema } from "@/lib/validators"
import { predictRisk } from "@/lib/health-model"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "30")

  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const { data, error } = await supabase
    .from("health_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("logged_at", fromDate.toISOString().split("T")[0])
    .order("logged_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logs: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = healthLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { systolic_bp, diastolic_bp, glucose, bmi, heart_rate, symptoms, notes } =
      parsed.data

    // Run prediction
    const prediction = predictRisk({
      systolic_bp,
      diastolic_bp,
      glucose,
      bmi,
      heart_rate,
      symptoms,
    })

    // Upsert (one log per day per user)
    const { data, error } = await supabase
      .from("health_logs")
      .upsert(
        {
          user_id: user.id,
          logged_at: new Date().toISOString().split("T")[0],
          systolic_bp,
          diastolic_bp,
          glucose,
          bmi,
          heart_rate,
          symptoms,
          risk_level: prediction.level,
          risk_score: prediction.score,
          notes,
        },
        { onConflict: "user_id,logged_at" }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ log: data, prediction })
  } catch {
    return NextResponse.json(
      { error: "Failed to save health log" },
      { status: 500 }
    )
  }
}
