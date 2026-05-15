import { AlertTriangle } from "lucide-react"

export function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground">
        <AlertTriangle className="mr-1 inline h-3 w-3" />
        For informational purposes only. Not a substitute for professional
        medical advice.
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-warning-foreground">
            Medical Disclaimer
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This tool is a rule-based heuristic screening system inspired by CDC
            diabetes, WHO BMI, and AHA/ACC hypertension risk thresholds. It is
            for{" "}
            <strong className="text-foreground">
              educational and informational purposes only
            </strong>{" "}
            and is NOT a diagnostic tool. Always consult a qualified healthcare
            professional for medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  )
}
