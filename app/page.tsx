import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Search,
  Stethoscope,
  LineChart,
  Shield,
  BookOpen,
  ArrowRight,
  Lock,
} from "lucide-react"

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)/0.08,transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:py-28">
            <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Scientifically-backed health analysis
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Your Personal
              <span className="text-primary"> Health Risk</span> Predictor
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Search diseases, check symptoms, assess health risks using CDC,
              WHO, and AHA/ACC clinical thresholds, and track your daily vitals
              with trend analytics.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  {user ? "Go to Dashboard" : "Try It Now"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {!user && (
                <Link href="/auth/sign-up">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Disease Search, Symptom Checker, and Risk Predictor work without
              an account. Sign up to unlock Health Tracking.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl text-balance">
              Everything you need to monitor your health
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four powerful tools in one dashboard, backed by real medical data
              sources.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">No login needed</Badge>
                </div>
                <CardTitle>Disease Search</CardTitle>
                <CardDescription>
                  Search 20+ diseases with detailed symptoms, precautions,
                  medicines, and &ldquo;when to see a doctor&rdquo; guidance. Plus
                  FDA drug label lookup powered by OpenFDA.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Stethoscope className="h-5 w-5 text-accent" />
                  </div>
                  <Badge variant="secondary" className="text-xs">No login needed</Badge>
                </div>
                <CardTitle>Symptom Checker</CardTitle>
                <CardDescription>
                  Select your symptoms and get ranked possible conditions with
                  confidence scores. Uses a proportional matching algorithm to
                  prevent common-disease bias.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                    <Activity className="h-5 w-5 text-chart-3" />
                  </div>
                  <Badge variant="secondary" className="text-xs">No login needed</Badge>
                </div>
                <CardTitle>Risk Predictor</CardTitle>
                <CardDescription>
                  Enter BP, glucose, BMI, heart rate, and symptoms to receive a
                  weighted risk score with factor-by-factor breakdown citing
                  ADA, CDC, WHO, and AHA/ACC thresholds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <LineChart className="h-5 w-5 text-warning-foreground" />
                  </div>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Lock className="h-3 w-3" />
                    Account required
                  </Badge>
                </div>
                <CardTitle>Health Tracker</CardTitle>
                <CardDescription>
                  Log daily vitals and track trends over time with interactive
                  charts, 7-day rolling averages, improvement percentages, and
                  trend direction indicators.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                Backed by trusted medical sources
              </h2>
              <p className="mt-3 text-muted-foreground">
                Our risk thresholds and data come from authoritative
                organizations.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Shield,
                  name: "ADA",
                  detail: "Diabetes glucose thresholds",
                },
                {
                  icon: Activity,
                  name: "AHA/ACC",
                  detail: "Blood pressure guidelines",
                },
                {
                  icon: BookOpen,
                  name: "CDC/WHO",
                  detail: "BMI classification",
                },
                {
                  icon: Search,
                  name: "OpenFDA",
                  detail: "Drug label database",
                },
              ].map(({ icon: Icon, name, detail }) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold text-foreground text-balance">
              Start exploring your health today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Try Disease Search, Symptom Checker, and Risk Predictor instantly
              -- no account needed. Sign up to unlock daily Health Tracking
              with trend analytics.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {!user && (
                <Link href="/auth/sign-up">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-primary" />
            HealthScope
          </div>
          <p className="text-center text-xs leading-relaxed text-muted-foreground max-w-md">
            For educational purposes only. Not a substitute for professional
            medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  )
}
