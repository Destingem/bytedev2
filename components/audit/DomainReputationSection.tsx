import { DomainReputation } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, AlertCircle, ShieldX, Shield, ThumbsUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DomainReputationSectionProps {
  reputation: DomainReputation
}

export function DomainReputationSection({ reputation }: DomainReputationSectionProps) {
  const { score, blacklisted, blacklistedOn, spamScore, malwareDetected } = reputation

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reputace domény</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reputation Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900">Skóre reputace</h3>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
              </div>
              <Progress value={score} className={`h-2 ${getProgressColor(score)}`} />
              
              <div className="mt-4">
                {score >= 80 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="h-5 w-5" />
                    <span className="font-medium">Výborná reputace</span>
                  </div>
                ) : score >= 50 ? (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Průměrná reputace</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Špatná reputace</span>
                  </div>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {score >= 80
                    ? "Tato doména má vynikající reputaci a důvěryhodnost."
                    : score >= 50
                    ? "Tato doména má průměrnou reputaci, existují oblasti ke zlepšení."
                    : "Tato doména má nízkou reputaci, což může indikovat problémy s důvěryhodností."}
                </p>
              </div>
            </div>

            {/* Reputation Factors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${blacklisted ? "text-red-500" : "text-green-500"}`} />
                  <span className="font-medium">Blacklist status</span>
                </div>
                {blacklisted ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Na blacklistu</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Čistá
                  </Badge>
                )}
              </div>
              
              {blacklisted && blacklistedOn && (
                <div className="pl-7 text-sm text-gray-600">
                  <p>Na blacklistech: {blacklistedOn.join(", ")}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Spam skóre</span>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    ${spamScore && spamScore > 5 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}
                  `}
                >
                  {spamScore}/10
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldX className={`h-5 w-5 ${malwareDetected ? "text-red-500" : "text-green-500"}`} />
                  <span className="font-medium">Malware detekce</span>
                </div>
                {malwareDetected ? (
                  <Badge variant="destructive">Detekován malware</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Čistá
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
