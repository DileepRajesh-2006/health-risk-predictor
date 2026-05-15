"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Stethoscope, Activity, LineChart } from "lucide-react"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { DiseaseSearch } from "@/components/disease-search"
import { SymptomChecker } from "@/components/symptom-checker"
import { RiskPredictor } from "@/components/risk-predictor"
import { HealthTracker } from "@/components/health-tracker"
import { AuthGate } from "@/components/auth-gate"

interface DashboardTabsProps {
  isAuthenticated: boolean
  userEmail: string | null
}

export function DashboardTabs({ isAuthenticated, userEmail }: DashboardTabsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
          Health Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search diseases, check symptoms, assess health risks, and track your
          daily vitals.
        </p>
        {isAuthenticated && userEmail && (
          <p className="mt-1 text-xs text-muted-foreground">
            {"Signed in as "}
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
        )}
      </div>

      <MedicalDisclaimer />

      <Tabs defaultValue="search" className="flex flex-col gap-4">
        <TabsList className="w-full grid grid-cols-4 h-11">
          <TabsTrigger value="search" className="gap-1.5 text-xs sm:text-sm">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Disease</span> Search
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="gap-1.5 text-xs sm:text-sm">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Symptom</span> Checker
          </TabsTrigger>
          <TabsTrigger value="predict" className="gap-1.5 text-xs sm:text-sm">
            <Activity className="h-4 w-4" />
            Risk <span className="hidden sm:inline">Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="tracker" className="gap-1.5 text-xs sm:text-sm">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span> Tracker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <DiseaseSearch />
        </TabsContent>

        <TabsContent value="symptoms">
          <SymptomChecker />
        </TabsContent>

        <TabsContent value="predict">
          <RiskPredictor />
        </TabsContent>

        <TabsContent value="tracker">
          {isAuthenticated ? (
            <HealthTracker />
          ) : (
            <AuthGate
              feature="Health Tracker"
              description="Sign in to log your daily vitals, track trends over time with interactive charts, 7-day rolling averages, and see whether you are improving or worsening."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
