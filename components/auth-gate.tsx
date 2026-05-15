import Link from "next/link"
import { Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AuthGateProps {
  feature: string
  description: string
}

export function AuthGate({ feature, description }: AuthGateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">
          Sign in to access {feature}
        </CardTitle>
        <CardDescription className="mx-auto max-w-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/auth/sign-up">
            <Button className="gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Disease Search, Symptom Checker, and Risk Predictor are available without an account.
        </p>
      </CardContent>
    </Card>
  )
}
