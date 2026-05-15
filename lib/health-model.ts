/**
 * Health Risk Prediction Model
 *
 * MEDICAL DISCLAIMER: This is a rule-based heuristic screening tool
 * intended for educational purposes only. It is NOT a diagnostic tool.
 * Always consult a qualified healthcare professional for medical advice.
 *
 * Risk Thresholds & Citations:
 * ┌──────────────────┬────────────────────────┬───────────────────────────────────────────────┐
 * │ Metric           │ Threshold              │ Source                                        │
 * ├──────────────────┼────────────────────────┼───────────────────────────────────────────────┤
 * │ Fasting Glucose  │ ≥126 mg/dL (Diabetes)  │ ADA Standards of Care 2024, Table 2.3         │
 * │                  │ 100-125 (Prediabetes)  │                                               │
 * │ BMI              │ ≥30 (Obese)            │ CDC/WHO BMI Classification                    │
 * │                  │ 25-29.9 (Overweight)   │                                               │
 * │ Systolic BP      │ ≥140 (Stage 2 HTN)    │ AHA/ACC 2017 Hypertension Guidelines          │
 * │                  │ 130-139 (Stage 1 HTN)  │                                               │
 * │                  │ 120-129 (Elevated)     │                                               │
 * │ Diastolic BP     │ ≥90 (Stage 2 HTN)     │ AHA/ACC 2017 Hypertension Guidelines          │
 * │                  │ 80-89 (Stage 1 HTN)    │                                               │
 * │ Heart Rate       │ >100 (Tachycardia)    │ AHA Clinical Guidelines                       │
 * │                  │ <60 (Bradycardia)      │                                               │
 * └──────────────────┴────────────────────────┴───────────────────────────────────────────────┘
 */

export interface HealthInput {
  systolic_bp: number
  diastolic_bp: number
  glucose: number
  bmi: number
  heart_rate?: number
  symptoms: string[]
}

export interface RiskResult {
  level: "Low" | "Moderate" | "High"
  score: number
  factors: RiskFactor[]
  recommendations: string[]
}

export interface RiskFactor {
  metric: string
  value: number | string
  status: "normal" | "elevated" | "high"
  detail: string
  citation: string
}

// ---------- Scoring Functions (each returns 0-100 contribution) ----------

function scoreGlucose(glucose: number): RiskFactor {
  if (glucose >= 126) {
    return {
      metric: "Fasting Glucose",
      value: glucose,
      status: "high",
      detail: `${glucose} mg/dL - Diabetic range (>=126)`,
      citation: "ADA Standards of Care 2024, Table 2.3",
    }
  }
  if (glucose >= 100) {
    return {
      metric: "Fasting Glucose",
      value: glucose,
      status: "elevated",
      detail: `${glucose} mg/dL - Prediabetic range (100-125)`,
      citation: "ADA Standards of Care 2024, Table 2.3",
    }
  }
  return {
    metric: "Fasting Glucose",
    value: glucose,
    status: "normal",
    detail: `${glucose} mg/dL - Normal range (<100)`,
    citation: "ADA Standards of Care 2024, Table 2.3",
  }
}

function scoreBMI(bmi: number): RiskFactor {
  if (bmi >= 30) {
    return {
      metric: "BMI",
      value: bmi,
      status: "high",
      detail: `${bmi} - Obese (>=30)`,
      citation: "CDC/WHO BMI Classification",
    }
  }
  if (bmi >= 25) {
    return {
      metric: "BMI",
      value: bmi,
      status: "elevated",
      detail: `${bmi} - Overweight (25-29.9)`,
      citation: "CDC/WHO BMI Classification",
    }
  }
  return {
    metric: "BMI",
    value: bmi,
    status: "normal",
    detail: `${bmi} - Normal weight (18.5-24.9)`,
    citation: "CDC/WHO BMI Classification",
  }
}

function scoreBloodPressure(
  systolic: number,
  diastolic: number
): RiskFactor {
  if (systolic >= 140 || diastolic >= 90) {
    return {
      metric: "Blood Pressure",
      value: `${systolic}/${diastolic}`,
      status: "high",
      detail: `${systolic}/${diastolic} mmHg - Stage 2 Hypertension`,
      citation: "AHA/ACC 2017 Hypertension Guidelines",
    }
  }
  if (systolic >= 130 || diastolic >= 80) {
    return {
      metric: "Blood Pressure",
      value: `${systolic}/${diastolic}`,
      status: "elevated",
      detail: `${systolic}/${diastolic} mmHg - Stage 1 Hypertension`,
      citation: "AHA/ACC 2017 Hypertension Guidelines",
    }
  }
  if (systolic >= 120) {
    return {
      metric: "Blood Pressure",
      value: `${systolic}/${diastolic}`,
      status: "elevated",
      detail: `${systolic}/${diastolic} mmHg - Elevated`,
      citation: "AHA/ACC 2017 Hypertension Guidelines",
    }
  }
  return {
    metric: "Blood Pressure",
    value: `${systolic}/${diastolic}`,
    status: "normal",
    detail: `${systolic}/${diastolic} mmHg - Normal (<120/80)`,
    citation: "AHA/ACC 2017 Hypertension Guidelines",
  }
}

function scoreHeartRate(hr: number | undefined): RiskFactor | null {
  if (hr === undefined) return null
  if (hr > 100) {
    return {
      metric: "Heart Rate",
      value: hr,
      status: "elevated",
      detail: `${hr} bpm - Tachycardia (>100)`,
      citation: "AHA Clinical Guidelines",
    }
  }
  if (hr < 60) {
    return {
      metric: "Heart Rate",
      value: hr,
      status: "elevated",
      detail: `${hr} bpm - Bradycardia (<60)`,
      citation: "AHA Clinical Guidelines",
    }
  }
  return {
    metric: "Heart Rate",
    value: hr,
    status: "normal",
    detail: `${hr} bpm - Normal (60-100)`,
    citation: "AHA Clinical Guidelines",
  }
}

// ---------- Main Prediction Function ----------

export function predictRisk(input: HealthInput): RiskResult {
  const factors: RiskFactor[] = []

  // Score each metric
  const glucoseFactor = scoreGlucose(input.glucose)
  const bmiFactor = scoreBMI(input.bmi)
  const bpFactor = scoreBloodPressure(input.systolic_bp, input.diastolic_bp)
  const hrFactor = scoreHeartRate(input.heart_rate)

  factors.push(glucoseFactor, bmiFactor, bpFactor)
  if (hrFactor) factors.push(hrFactor)

  // Symptom factor
  if (input.symptoms.length > 0) {
    factors.push({
      metric: "Symptoms",
      value: input.symptoms.join(", "),
      status: input.symptoms.length >= 3 ? "high" : input.symptoms.length >= 1 ? "elevated" : "normal",
      detail: `${input.symptoms.length} symptom(s) reported: ${input.symptoms.join(", ")}`,
      citation: "Self-reported symptom assessment",
    })
  }

  // Calculate weighted score (0-100)
  let score = 0
  const weights = { glucose: 30, bmi: 20, bp: 30, hr: 10, symptoms: 10 }

  // Glucose contribution (0-30)
  if (glucoseFactor.status === "high") score += weights.glucose
  else if (glucoseFactor.status === "elevated") score += weights.glucose * 0.5

  // BMI contribution (0-20)
  if (bmiFactor.status === "high") score += weights.bmi
  else if (bmiFactor.status === "elevated") score += weights.bmi * 0.5

  // BP contribution (0-30)
  if (bpFactor.status === "high") score += weights.bp
  else if (bpFactor.status === "elevated") score += weights.bp * 0.5

  // Heart rate contribution (0-10)
  if (hrFactor) {
    if (hrFactor.status === "high") score += weights.hr
    else if (hrFactor.status === "elevated") score += weights.hr * 0.5
  }

  // Symptoms contribution (0-10)
  const symptomCount = input.symptoms.length
  if (symptomCount >= 3) score += weights.symptoms
  else if (symptomCount >= 1) score += weights.symptoms * (symptomCount / 3)

  // Round to 1 decimal
  score = Math.round(score * 10) / 10

  // Determine risk level
  let level: "Low" | "Moderate" | "High"
  if (score >= 60) level = "High"
  else if (score >= 30) level = "Moderate"
  else level = "Low"

  // Generate recommendations
  const recommendations = generateRecommendations(factors, level)

  return { level, score, factors, recommendations }
}

function generateRecommendations(
  factors: RiskFactor[],
  level: "Low" | "Moderate" | "High"
): string[] {
  const recs: string[] = []

  for (const f of factors) {
    if (f.metric === "Fasting Glucose" && f.status !== "normal") {
      recs.push(
        "Monitor fasting blood glucose regularly. Consider HbA1c testing."
      )
      if (f.status === "high")
        recs.push(
          "Consult an endocrinologist for diabetes management."
        )
    }
    if (f.metric === "BMI" && f.status !== "normal") {
      recs.push(
        "Aim for 150 minutes/week of moderate-intensity aerobic activity (WHO recommendation)."
      )
      if (f.status === "high")
        recs.push(
          "Consider consulting a dietitian for a personalized nutrition plan."
        )
    }
    if (f.metric === "Blood Pressure" && f.status !== "normal") {
      recs.push(
        "Reduce sodium intake to <2,300mg/day. Monitor BP at home daily."
      )
      if (f.status === "high")
        recs.push(
          "Seek medical evaluation for antihypertensive therapy."
        )
    }
    if (f.metric === "Heart Rate" && f.status !== "normal") {
      recs.push(
        "Abnormal resting heart rate detected. Consult your physician."
      )
    }
  }

  if (level === "Low") {
    recs.push("Maintain your healthy lifestyle with regular check-ups.")
  } else if (level === "High") {
    recs.push(
      "IMPORTANT: Schedule an appointment with your healthcare provider soon."
    )
  }

  // Deduplicate
  return [...new Set(recs)]
}

// ---------- Analytics Helpers ----------

export interface TrendAnalysis {
  metric: string
  current: number
  previous: number
  change: number
  changePercent: number
  direction: "improving" | "worsening" | "stable"
  rollingAvg7: number
}

export function calculateTrend(
  values: { date: string; value: number }[],
  metric: string,
  lowerIsBetter = true
): TrendAnalysis | null {
  if (values.length < 2) return null

  const sorted = [...values].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const current = sorted[sorted.length - 1].value
  const previous = sorted[sorted.length - 2].value
  const change = current - previous
  const changePercent =
    previous !== 0 ? Math.round((change / previous) * 1000) / 10 : 0

  // Calculate 7-day rolling average
  const last7 = sorted.slice(-7)
  const rollingAvg7 =
    Math.round(
      (last7.reduce((sum, v) => sum + v.value, 0) / last7.length) * 10
    ) / 10

  let direction: "improving" | "worsening" | "stable"
  const threshold = 2 // 2% change threshold for "stable"
  if (Math.abs(changePercent) < threshold) {
    direction = "stable"
  } else if (lowerIsBetter) {
    direction = change < 0 ? "improving" : "worsening"
  } else {
    direction = change > 0 ? "improving" : "worsening"
  }

  return { metric, current, previous, change, changePercent, direction, rollingAvg7 }
}

export function calculateRollingAverage(
  values: { date: string; value: number }[],
  windowSize: number = 7
): { date: string; value: number; rollingAvg: number }[] {
  const sorted = [...values].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return sorted.map((item, index) => {
    const start = Math.max(0, index - windowSize + 1)
    const window = sorted.slice(start, index + 1)
    const rollingAvg =
      Math.round(
        (window.reduce((sum, v) => sum + v.value, 0) / window.length) * 10
      ) / 10
    return { ...item, rollingAvg }
  })
}
