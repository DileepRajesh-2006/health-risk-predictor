"use client"

import { useState } from "react"
import {
  Stethoscope,
  Shield,
  Pill,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { ALL_SYMPTOMS, type DiseaseMatch } from "@/lib/diseases"

interface SymptomResult {
  matches: DiseaseMatch[]
  disclaimer: string
}

export function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([])
  const [results, setResults] = useState<SymptomResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  function toggleSymptom(symptom: string) {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : prev.length < 10
        ? [...prev, symptom]
        : prev
    )
  }

  async function handleCheck() {
    if (selected.length === 0) return
    setLoading(true)
    setResults(null)
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected }),
      })
      const data = await res.json()
      setResults(data)
    } catch {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setSelected([])
    setResults(null)
    setExpandedMatch(null)
  }

  const severityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "text-success"
      case "moderate":
        return "text-warning-foreground"
      case "severe":
        return "text-destructive"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Select your symptoms below to find possible conditions. Confidence
            is calculated as the ratio of matched symptoms to total symptoms of
            each disease.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Select symptoms ({selected.length}/10):
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_SYMPTOMS.map((symptom) => {
                const isSelected = selected.includes(symptom)
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {symptom}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCheck}
              disabled={selected.length === 0 || loading}
              className="gap-2"
            >
              {loading ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Stethoscope className="h-4 w-4" />
                  Check Symptoms
                </>
              )}
            </Button>
            {selected.length > 0 && (
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {results && results.matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Possible Conditions ({results.matches.length})
            </CardTitle>
            <CardDescription>
              Ranked by confidence score (matched symptoms / total symptoms).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {results.matches.map((match) => {
              const isExpanded = expandedMatch === match.disease.name
              return (
                <div
                  key={match.disease.name}
                  className="rounded-lg border border-border"
                >
                  <button
                    className="flex w-full items-center justify-between p-4 text-left"
                    onClick={() =>
                      setExpandedMatch(isExpanded ? null : match.disease.name)
                    }
                  >
                    <div className="flex flex-col gap-1.5 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {match.disease.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={severityColor(match.disease.severity)}
                        >
                          {match.disease.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={match.confidence}
                            className="h-2 w-24"
                          />
                          <span className="text-xs font-medium text-foreground">
                            {match.confidence}%
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {match.matchCount} of{" "}
                          {match.disease.symptoms.length} symptoms match
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3">
                      <p className="mb-3 text-sm text-muted-foreground">
                        {match.disease.description}
                      </p>

                      <div className="mb-3">
                        <h4 className="mb-1.5 text-xs font-medium text-foreground">
                          Matched Symptoms
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {match.disease.symptoms.map((s) => (
                            <Badge
                              key={s}
                              variant={
                                match.matchedSymptoms.includes(s)
                                  ? "default"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {s}
                              {match.matchedSymptoms.includes(s) && " *"}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                            <Shield className="h-3.5 w-3.5 text-accent" />
                            Precautions
                          </h4>
                          <ul className="flex flex-col gap-0.5">
                            {match.disease.precautions.map((p) => (
                              <li
                                key={p}
                                className="text-xs text-muted-foreground before:mr-1.5 before:text-primary before:content-['•']"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                            <Pill className="h-3.5 w-3.5 text-chart-2" />
                            Common Medicines
                          </h4>
                          <ul className="flex flex-col gap-0.5">
                            {match.disease.medicines.map((m) => (
                              <li
                                key={m}
                                className="text-xs text-muted-foreground before:mr-1.5 before:text-chart-2 before:content-['•']"
                              >
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-3 rounded-md bg-muted/50 p-2.5">
                        <p className="text-xs text-muted-foreground">
                          <AlertCircle className="mr-1 inline h-3 w-3" />
                          <strong>When to see a doctor:</strong>{" "}
                          {match.disease.whenToSeeDoctor}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <MedicalDisclaimer compact />
          </CardContent>
        </Card>
      )}

      {results && results.matches.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            <Stethoscope className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No matching conditions found for the selected symptoms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
