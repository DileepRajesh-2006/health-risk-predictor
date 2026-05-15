"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Heart,
  Droplets,
  Scale,
  Zap,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { toast } from "sonner"
import { calculateTrend, calculateRollingAverage } from "@/lib/health-model"
import { ALL_SYMPTOMS } from "@/lib/diseases"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface HealthLog {
  id: string
  logged_at: string
  systolic_bp: number
  diastolic_bp: number
  glucose: number
  bmi: number
  heart_rate: number | null
  symptoms: string[]
  risk_level: string
  risk_score: number
  notes: string | null
}

const SYMPTOM_OPTIONS = ALL_SYMPTOMS.slice(0, 10)

export function HealthTracker() {
  const [days, setDays] = useState(30)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    systolic_bp: "",
    diastolic_bp: "",
    glucose: "",
    bmi: "",
    heart_rate: "",
    notes: "",
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const { data, isLoading } = useSWR<{ logs: HealthLog[] }>(
    `/api/health-logs?days=${days}`,
    fetcher
  )

  const logs = data?.logs || []

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch("/api/health-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systolic_bp: Number(form.systolic_bp),
          diastolic_bp: Number(form.diastolic_bp),
          glucose: Number(form.glucose),
          bmi: Number(form.bmi),
          heart_rate: form.heart_rate ? Number(form.heart_rate) : undefined,
          symptoms: selectedSymptoms,
          notes: form.notes || undefined,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "Failed to save log")
        return
      }

      toast.success(
        `Health log saved. Risk: ${result.prediction.level} (${result.prediction.score}/100)`
      )

      // Reset form
      setForm({
        systolic_bp: "",
        diastolic_bp: "",
        glucose: "",
        bmi: "",
        heart_rate: "",
        notes: "",
      })
      setSelectedSymptoms([])
      setShowForm(false)
      mutate(`/api/health-logs?days=${days}`)
    } catch {
      toast.error("Failed to save health log")
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate trends
  const bpData = logs.map((l) => ({
    date: l.logged_at,
    value: l.systolic_bp,
  }))
  const glucoseData = logs.map((l) => ({
    date: l.logged_at,
    value: l.glucose,
  }))
  const bmiData = logs.map((l) => ({ date: l.logged_at, value: l.bmi }))
  const riskData = logs.map((l) => ({
    date: l.logged_at,
    value: l.risk_score,
  }))

  const bpTrend = calculateTrend(bpData, "Blood Pressure", true)
  const glucoseTrend = calculateTrend(glucoseData, "Glucose", true)
  const bmiTrend = calculateTrend(bmiData, "BMI", true)
  const riskTrend = calculateTrend(riskData, "Risk Score", true)

  // Chart data with rolling averages
  const bpRolling = calculateRollingAverage(bpData, 7)
  const glucoseRolling = calculateRollingAverage(glucoseData, 7)

  const chartData = logs.map((log, i) => ({
    date: new Date(log.logged_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    systolic: log.systolic_bp,
    diastolic: log.diastolic_bp,
    glucose: log.glucose,
    bmi: log.bmi,
    riskScore: log.risk_score,
    bpRollingAvg: bpRolling[i]?.rollingAvg || log.systolic_bp,
    glucoseRollingAvg: glucoseRolling[i]?.rollingAvg || log.glucose,
  }))

  const TrendIcon = ({ direction }: { direction?: string }) => {
    if (direction === "improving")
      return <TrendingDown className="h-4 w-4 text-success" />
    if (direction === "worsening")
      return <TrendingUp className="h-4 w-4 text-destructive" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const trendLabel = (direction?: string) => {
    if (direction === "improving") return "Improving"
    if (direction === "worsening") return "Worsening"
    return "Stable"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {[7, 14, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Today
        </Button>
      </div>

      {/* Log Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Log Today{"'"}s Health Data</CardTitle>
            <CardDescription>
              Enter your current readings. One entry per day (updates if
              already logged today).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-sbp">Systolic BP (mmHg)</Label>
                <Input
                  id="t-sbp"
                  type="number"
                  placeholder="120"
                  value={form.systolic_bp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, systolic_bp: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-dbp">Diastolic BP (mmHg)</Label>
                <Input
                  id="t-dbp"
                  type="number"
                  placeholder="80"
                  value={form.diastolic_bp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, diastolic_bp: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-glucose">Glucose (mg/dL)</Label>
                <Input
                  id="t-glucose"
                  type="number"
                  placeholder="95"
                  value={form.glucose}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, glucose: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-bmi">BMI</Label>
                <Input
                  id="t-bmi"
                  type="number"
                  step="0.1"
                  placeholder="22.5"
                  value={form.bmi}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bmi: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-hr">Heart Rate (bpm, optional)</Label>
                <Input
                  id="t-hr"
                  type="number"
                  placeholder="72"
                  value={form.heart_rate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, heart_rate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Symptoms</Label>
              <div className="flex flex-wrap gap-1.5">
                {SYMPTOM_OPTIONS.map((s) => {
                  const isActive = selectedSymptoms.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-notes">Notes (optional)</Label>
              <Textarea
                id="t-notes"
                placeholder="How are you feeling today?"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !form.systolic_bp ||
                  !form.diastolic_bp ||
                  !form.glucose ||
                  !form.bmi
                }
              >
                {submitting ? "Saving..." : "Save Log"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Cards */}
      {logs.length >= 2 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Blood Pressure",
              trend: bpTrend,
              unit: "mmHg",
              icon: Heart,
              iconColor: "text-destructive",
            },
            {
              label: "Glucose",
              trend: glucoseTrend,
              unit: "mg/dL",
              icon: Droplets,
              iconColor: "text-primary",
            },
            {
              label: "BMI",
              trend: bmiTrend,
              unit: "",
              icon: Scale,
              iconColor: "text-chart-2",
            },
            {
              label: "Risk Score",
              trend: riskTrend,
              unit: "/100",
              icon: Zap,
              iconColor: "text-warning-foreground",
            },
          ].map(({ label, trend, unit, icon: Icon, iconColor }) => (
            <Card key={label}>
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {trend?.current ?? "--"}
                  </span>
                  <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendIcon direction={trend?.direction} />
                  <span className="text-xs text-muted-foreground">
                    {trendLabel(trend?.direction)}
                  </span>
                  {trend && (
                    <Badge
                      variant="outline"
                      className={`ml-auto text-[10px] ${
                        trend.direction === "improving"
                          ? "text-success"
                          : trend.direction === "worsening"
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {trend.changePercent > 0 ? "+" : ""}
                      {trend.changePercent}%
                    </Badge>
                  )}
                </div>
                {trend && (
                  <p className="text-[10px] text-muted-foreground">
                    7-day avg: {trend.rollingAvg7}
                    {unit}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      {chartData.length >= 2 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-destructive" />
                Blood Pressure & Glucose Trends
              </CardTitle>
              <CardDescription>
                Solid lines show daily readings. Dashed lines show 7-day
                rolling averages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--card)",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      name="Systolic BP"
                      stroke="var(--color-destructive)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      name="Diastolic BP"
                      stroke="var(--color-chart-4)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bpRollingAvg"
                      name="BP 7d Avg"
                      stroke="var(--color-destructive)"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      name="Glucose"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="glucoseRollingAvg"
                      name="Glucose 7d Avg"
                      stroke="var(--color-primary)"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="h-4 w-4 text-warning-foreground" />
                Risk Score Trend
              </CardTitle>
              <CardDescription>
                Overall risk score over time (0 = Low risk, 100 = High risk).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--card)",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="riskScore"
                      name="Risk Score"
                      stroke="var(--color-warning)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {!isLoading && logs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center p-10">
            <LineChart className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium text-foreground">
              No health logs yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &ldquo;Log Today&rdquo; to start tracking your health
              metrics and see trends over time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Log History */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">BP</th>
                    <th className="pb-2 pr-4">Glucose</th>
                    <th className="pb-2 pr-4">BMI</th>
                    <th className="pb-2 pr-4">Risk</th>
                    <th className="pb-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...logs].reverse().slice(0, 10).map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-foreground">
                        {new Date(log.logged_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground">
                        {log.systolic_bp}/{log.diastolic_bp}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground">
                        {log.glucose}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground">{log.bmi}</td>
                      <td className="py-2.5 pr-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            log.risk_level === "High"
                              ? "text-destructive"
                              : log.risk_level === "Moderate"
                              ? "text-warning-foreground"
                              : "text-success"
                          }`}
                        >
                          {log.risk_level}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-foreground">{log.risk_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <MedicalDisclaimer compact />
    </div>
  )
}
