import { z } from "zod"

// ============================================================
// Zod Validation Schemas for Health Data
// Ranges based on clinically plausible values
// ============================================================

export const healthLogSchema = z.object({
  systolic_bp: z
    .number({ required_error: "Systolic BP is required" })
    .min(60, "Systolic BP must be at least 60 mmHg")
    .max(250, "Systolic BP cannot exceed 250 mmHg"),
  diastolic_bp: z
    .number({ required_error: "Diastolic BP is required" })
    .min(30, "Diastolic BP must be at least 30 mmHg")
    .max(150, "Diastolic BP cannot exceed 150 mmHg"),
  glucose: z
    .number({ required_error: "Glucose level is required" })
    .min(20, "Glucose must be at least 20 mg/dL")
    .max(600, "Glucose cannot exceed 600 mg/dL"),
  bmi: z
    .number({ required_error: "BMI is required" })
    .min(10, "BMI must be at least 10")
    .max(70, "BMI cannot exceed 70"),
  heart_rate: z
    .number()
    .min(30, "Heart rate must be at least 30 bpm")
    .max(220, "Heart rate cannot exceed 220 bpm")
    .optional(),
  symptoms: z.array(z.string()).default([]),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
})

export type HealthLogInput = z.infer<typeof healthLogSchema>

export const profileSchema = z.object({
  display_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name cannot exceed 100 characters"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

export const symptomSearchSchema = z.object({
  symptoms: z
    .array(z.string())
    .min(1, "Select at least one symptom")
    .max(10, "Cannot select more than 10 symptoms"),
})

export type SymptomSearchInput = z.infer<typeof symptomSearchSchema>

export const diseaseSearchSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query cannot exceed 100 characters"),
})

export type DiseaseSearchInput = z.infer<typeof diseaseSearchSchema>
