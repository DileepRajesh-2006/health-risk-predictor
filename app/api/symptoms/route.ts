import { NextRequest, NextResponse } from "next/server"
import { symptomSearchSchema } from "@/lib/validators"
import { checkSymptoms, ALL_SYMPTOMS } from "@/lib/diseases"

export async function GET() {
  return NextResponse.json({ symptoms: ALL_SYMPTOMS })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = symptomSearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const matches = checkSymptoms(parsed.data.symptoms)

    return NextResponse.json({
      matches,
      disclaimer:
        "This symptom checker is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to check symptoms" },
      { status: 500 }
    )
  }
}
