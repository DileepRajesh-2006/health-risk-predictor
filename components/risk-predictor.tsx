"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Progress } from "@/components/ui/progress"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { ALL_SYMPTOMS } from "@/lib/diseases"
import type { RiskResult } from "@/lib/health-model"

const COMMON_SYMPTOMS = ALL_SYMPTOMS.slice(0, 15)

export function RiskPredictor() {
  const [form, setForm] = useState({
    systolic_bp: "",
    diastolic_bp: "",
    glucose: "",
    bmi: "",
    heart_rate: "",
    gender: "",
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [result, setResult] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  async function handlePredict() {
    setLoading(true)
    setErrors({})
    setResult(null)

    const payload = {
      systolic_bp: Number(form.systolic_bp),
      diastolic_bp: Number(form.diastolic_bp),
      glucose: Number(form.glucose),
      bmi: Number(form.bmi),
      heart_rate: form.heart_rate ? Number(form.heart_rate) : undefined,
      symptoms: selectedSymptoms,
    }

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details)
        }
        return
      }

      setResult(data)
    } catch {
      // Error handled
    } finally {
      setLoading(false)
    }
  }

  const riskConfig = {
    Low: {
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
      icon: CheckCircle2,
    },
    Moderate: {
      color: "text-warning-foreground",
      bg: "bg-warning/10",
      border: "border-warning/20",
      icon: AlertTriangle,
    },
    High: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
      icon: ShieldAlert,
    },
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Health Risk Assessment
          </CardTitle>
          <CardDescription>
            Enter your health metrics to receive a risk assessment based on
            CDC, WHO, and AHA/ACC clinical thresholds.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Blood Pressure */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={form.systolic_bp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, systolic_bp: e.target.value }))
                }
              />
              {errors.systolic_bp && (
                <p className="text-xs text-destructive">
                  {errors.systolic_bp[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={form.diastolic_bp}
                onChange={(e) =>
                  setForm((f) => ({ ...f, diastolic_bp: e.target.value }))
                }
              />
              {errors.diastolic_bp && (
                <p className="text-xs text-destructive">
                  {errors.diastolic_bp[0]}
                </p>
              )}
            </div>

            {/* Glucose */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="glucose">Fasting Glucose (mg/dL)</Label>
              <Input
                id="glucose"
                type="number"
                placeholder="95"
                value={form.glucose}
                onChange={(e) =>
                  setForm((f) => ({ ...f, glucose: e.target.value }))
                }
              />
              {errors.glucose && (
                <p className="text-xs text-destructive">{errors.glucose[0]}</p>
              )}
            </div>

            {/* BMI */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="22.5"
                value={form.bmi}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bmi: e.target.value }))
                }
              />
              {errors.bmi && (
                <p className="text-xs text-destructive">{errors.bmi[0]}</p>
              )}
            </div>

            {/* Heart Rate */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hr">Heart Rate (bpm, optional)</Label>
              <Input
                id="hr"
                type="number"
                placeholder="72"
                value={form.heart_rate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, heart_rate: e.target.value }))
                }
              />
              {errors.heart_rate && (
                <p className="text-xs text-destructive">
                  {errors.heart_rate[0]}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <Label>Gender (optional)</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <Label className="mb-2 block">Current Symptoms (optional)</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom)
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {symptom}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={
              loading ||
              !form.systolic_bp ||
              !form.diastolic_bp ||
              !form.glucose ||
              !form.bmi
            }
            className="w-full sm:w-auto"
          >
            {loading ? "Analyzing..." : "Assess Risk"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Risk Score Card */}
          <Card
            className={`${riskConfig[result.level].border} border-2`}
          >
            <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${riskConfig[result.level].bg}`}
              >
                {(() => {
                  const Icon = riskConfig[result.level].icon
                  return (
                    <Icon
                      className={`h-10 w-10 ${riskConfig[result.level].color}`}
                    />
                  )
                })()}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-medium text-muted-foreground">
                  Risk Level
                </p>
                <p
                  className={`text-3xl font-bold ${riskConfig[result.level].color}`}
                >
                  {result.level}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={result.score} className="h-2.5 flex-1" />
                  <span className="text-sm font-medium text-foreground">
                    {result.score}/100
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Factor Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {result.factors.map((factor) => {
                  const statusColor =
                    factor.status === "high"
                      ? "text-destructive"
                      : factor.status === "elevated"
                      ? "text-warning-foreground"
                      : "text-success"

                  return (
                    <div
                      key={factor.metric}
                      className="flex items-start justify-between rounded-md border border-border p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {factor.metric}
                        </span>
                        <span className={`text-xs ${statusColor}`}>
                          {factor.detail}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusColor}`}
                        >
                          {factor.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {factor.citation}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {result.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <MedicalDisclaimer />
        </div>
      )}
    </div>
  )
}
