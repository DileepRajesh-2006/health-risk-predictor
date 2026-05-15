import { NextRequest, NextResponse } from "next/server"
import { healthLogSchema } from "@/lib/validators"
import { predictRisk } from "@/lib/health-model"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = healthLogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { systolic_bp, diastolic_bp, glucose, bmi, heart_rate, symptoms } =
      parsed.data

    const result = predictRisk({
      systolic_bp,
      diastolic_bp,
      glucose,
      bmi,
      heart_rate,
      symptoms,
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Failed to process prediction" },
      { status: 500 }
    )
  }
}
