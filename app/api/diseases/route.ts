import { NextRequest, NextResponse } from "next/server"
import { searchDiseases, DISEASES } from "@/lib/diseases"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""

  let results = query ? searchDiseases(query) : DISEASES

  if (category) {
    results = results.filter(
      (d) => d.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Get unique categories for filtering
  const categories = [...new Set(DISEASES.map((d) => d.category))].sort()

  return NextResponse.json({ diseases: results, categories })
}
