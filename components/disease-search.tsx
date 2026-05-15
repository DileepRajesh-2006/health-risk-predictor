"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Search,
  Pill,
  Shield,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import type { Disease } from "@/lib/diseases"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface DiseaseResult {
  diseases: Disease[]
  categories: string[]
}

interface DrugResult {
  brand_name: string
  generic_name: string
  manufacturer: string
  purpose?: string
  indications_and_usage?: string
  warnings?: string
  dosage_and_administration?: string
  active_ingredient?: string
}

interface DrugResponse {
  results: DrugResult[]
  total: number
  disclaimer: string
  error?: string
}

export function DiseaseSearch() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null)
  const [drugQuery, setDrugQuery] = useState("")
  const [drugSearch, setDrugSearch] = useState("")

  const searchParams = new URLSearchParams()
  if (query.length >= 2) searchParams.set("q", query)
  if (category !== "all") searchParams.set("category", category)

  const { data, isLoading } = useSWR<DiseaseResult>(
    query.length >= 2 || category !== "all"
      ? `/api/diseases?${searchParams.toString()}`
      : null,
    fetcher
  )

  const { data: drugData, isLoading: drugLoading } = useSWR<DrugResponse>(
    drugSearch.length >= 2 ? `/api/drugs?q=${encodeURIComponent(drugSearch)}` : null,
    fetcher
  )

  const severityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-success/10 text-success border-success/20"
      case "moderate":
        return "bg-warning/10 text-warning-foreground border-warning/20"
      case "severe":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Disease Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Search Diseases
          </CardTitle>
          <CardDescription>
            Search by disease name, symptom, or category to find detailed
            information, precautions, and medicines.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search diseases, symptoms..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(data?.categories || []).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          )}

          {data?.diseases && data.diseases.length === 0 && query.length >= 2 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No diseases found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {data?.diseases?.map((disease) => {
              const isExpanded = expandedDisease === disease.name
              return (
                <div
                  key={disease.name}
                  className="rounded-lg border border-border bg-card transition-all"
                >
                  <button
                    className="flex w-full items-start justify-between p-4 text-left"
                    onClick={() =>
                      setExpandedDisease(isExpanded ? null : disease.name)
                    }
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {disease.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={severityColor(disease.severity)}
                        >
                          {disease.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {disease.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {disease.description}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Symptoms */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            Symptoms
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {disease.symptoms.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Precautions */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Shield className="h-4 w-4 text-accent" />
                            Precautions
                          </h4>
                          <ul className="flex flex-col gap-1">
                            {disease.precautions.map((p) => (
                              <li
                                key={p}
                                className="text-xs text-muted-foreground before:mr-1.5 before:text-primary before:content-['•']"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Medicines */}
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Pill className="h-4 w-4 text-chart-2" />
                            Common Medicines
                          </h4>
                          <ul className="flex flex-col gap-1">
                            {disease.medicines.map((m) => (
                              <li
                                key={m}
                                className="text-xs text-muted-foreground before:mr-1.5 before:text-chart-2 before:content-['•']"
                              >
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* When to see doctor */}
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-foreground">
                            When to See a Doctor
                          </h4>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {disease.whenToSeeDoctor}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Drug Search (OpenFDA) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-chart-2" />
            Drug Information (FDA)
          </CardTitle>
          <CardDescription>
            Search FDA-verified drug labels for usage, dosage, and warnings.
            Powered by OpenFDA.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setDrugSearch(drugQuery)
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drug name (e.g., Ibuprofen, Tylenol)..."
                className="pl-9"
                value={drugQuery}
                onChange={(e) => setDrugQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={drugQuery.length < 2}>
              Search
            </Button>
          </form>

          {drugLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          )}

          {drugData?.error && (
            <p className="text-sm text-destructive">{drugData.error}</p>
          )}

          {drugData?.results && drugData.results.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Pill className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No drugs found. Try a different search term.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {drugData?.results?.map((drug, index) => (
              <div
                key={`${drug.brand_name}-${index}`}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {drug.brand_name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Generic: {drug.generic_name} | Manufacturer:{" "}
                      {drug.manufacturer}
                    </p>
                  </div>
                </div>
                {drug.purpose && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-foreground">
                      Purpose
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {drug.purpose}
                    </p>
                  </div>
                )}
                {drug.indications_and_usage && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-foreground">
                      Indications & Usage
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {drug.indications_and_usage}
                    </p>
                  </div>
                )}
                {drug.dosage_and_administration && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-foreground">
                      Dosage
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {drug.dosage_and_administration}
                    </p>
                  </div>
                )}
                {drug.warnings && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-destructive">
                      Warnings
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {drug.warnings}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {drugData?.disclaimer && drugData.results && drugData.results.length > 0 && (
            <MedicalDisclaimer compact />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
