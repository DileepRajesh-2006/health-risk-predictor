import { NextRequest, NextResponse } from "next/server"

/**
 * OpenFDA Drug Label API proxy
 * Docs: https://open.fda.gov/apis/drug/label/
 *
 * This searches FDA drug labels for indications, usage, warnings, etc.
 * No API key required for basic usage (40 requests/minute limit).
 */

const OPENFDA_BASE = "https://api.fda.gov/drug/label.json"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    )
  }

  try {
    // Search by brand name or generic name
    const searchQuery = `(openfda.brand_name:"${query}"+openfda.generic_name:"${query}")`
    const url = `${OPENFDA_BASE}?search=${encodeURIComponent(searchQuery)}&limit=5`

    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!response.ok) {
      // OpenFDA returns 404 when no results found
      if (response.status === 404) {
        return NextResponse.json({ results: [], total: 0 })
      }
      throw new Error(`OpenFDA API error: ${response.status}`)
    }

    const data = await response.json()

    const results = (data.results || []).map((drug: Record<string, unknown>) => {
      const openfda = drug.openfda as Record<string, string[]> | undefined
      return {
        brand_name: openfda?.brand_name?.[0] || "Unknown",
        generic_name: openfda?.generic_name?.[0] || "Unknown",
        manufacturer: openfda?.manufacturer_name?.[0] || "Unknown",
        purpose: Array.isArray(drug.purpose) ? drug.purpose[0] : undefined,
        indications_and_usage: Array.isArray(drug.indications_and_usage)
          ? drug.indications_and_usage[0]
          : undefined,
        warnings: Array.isArray(drug.warnings) ? drug.warnings[0] : undefined,
        dosage_and_administration: Array.isArray(drug.dosage_and_administration)
          ? drug.dosage_and_administration[0]
          : undefined,
        active_ingredient: Array.isArray(drug.active_ingredient)
          ? drug.active_ingredient[0]
          : undefined,
      }
    })

    return NextResponse.json({
      results,
      total: data.meta?.results?.total || 0,
      disclaimer:
        "Drug information sourced from FDA. Always consult a healthcare professional before taking any medication.",
    })
  } catch (error) {
    console.error("OpenFDA API error:", error)
    return NextResponse.json(
      { error: "Failed to search drugs. Please try again." },
      { status: 500 }
    )
  }
}
