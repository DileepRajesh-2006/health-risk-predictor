import { NextRequest, NextResponse } from "next/server"

/**
 * WHO ICD-11 API Proxy with OAuth2 Token Caching
 *
 * Docs: https://icd.who.int/icdapi
 * Token is cached in-memory for 50 minutes (validity is 60 min)
 *
 * Requires WHO_ICD_CLIENT_ID and WHO_ICD_CLIENT_SECRET env vars.
 * If not configured, falls back to the built-in disease dataset.
 */

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.WHO_ICD_CLIENT_ID
  const clientSecret = process.env.WHO_ICD_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return null
  }

  // Return cached token if still valid (50 min window)
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  try {
    const response = await fetch("https://icdaccessmanagement.who.int/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "icdapi_access",
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      console.error("WHO ICD token error:", response.status)
      return null
    }

    const data = await response.json()
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + 50 * 60 * 1000, // 50 minutes
    }

    return data.access_token
  } catch (error) {
    console.error("WHO ICD token fetch failed:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    )
  }

  const token = await getAccessToken()

  if (!token) {
    // Fallback message when WHO API is not configured
    return NextResponse.json({
      results: [],
      fallback: true,
      message:
        "WHO ICD-11 API not configured. Using built-in disease database. Set WHO_ICD_CLIENT_ID and WHO_ICD_CLIENT_SECRET for WHO data.",
    })
  }

  try {
    const url = `https://id.who.int/icd/release/11/2024-01/mms/search?q=${encodeURIComponent(query)}&subtreeFilterUsesFoundationDescendants=false&includeKeywordResult=true&useFlexisearch=true&flatResults=true&highlightingEnabled=false`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "en",
        "API-Version": "v2",
      },
    })

    if (!response.ok) {
      throw new Error(`WHO ICD API error: ${response.status}`)
    }

    const data = await response.json()

    const results = (data.destinationEntities || [])
      .slice(0, 10)
      .map((entity: Record<string, unknown>) => ({
        id: entity.id,
        title: entity.title
          ? String(entity.title).replace(/<[^>]+>/g, "")
          : "Unknown",
        code: entity.theCode || null,
        chapter: entity.chapter || null,
      }))

    return NextResponse.json({
      results,
      fallback: false,
      total: data.destinationEntities?.length || 0,
    })
  } catch (error) {
    console.error("WHO ICD search error:", error)
    return NextResponse.json(
      { error: "Failed to search WHO ICD-11 database" },
      { status: 500 }
    )
  }
}
