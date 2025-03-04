import { SecurityInfo } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle, Info, Lock, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SecurityAnalysisSectionProps {
  securityInfo: SecurityInfo
}

export function SecurityAnalysisSection({ securityInfo }: SecurityAnalysisSectionProps) {
  const { ssl, headers, vulnerabilities } = securityInfo

  // Calculate security score based on SSL validity and headers
  const calculateSecurityScore = () => {
    let score = 0
    
    // SSL adds 50% of the score
    if (ssl.valid) {
      score += 50
      
      // If SSL is valid and expires in more than 60 days, add more points
      if (ssl.daysToExpiry && ssl.daysToExpiry > 60) {
        score += 10
      }
    }
    
    // Security headers add up to 40% of the score
    const goodHeaders = headers.filter(h => h.status === "good").length
    score += Math.round((goodHeaders / headers.length) * 40)
    
    // If no vulnerabilities, add 10%
    if (!vulnerabilities || vulnerabilities.length === 0) {
      score += 10
    } else {
      // If there are only low severity vulnerabilities, add 5%
      if (vulnerabilities.every(v => v.severity === "low")) {
        score += 5
      }
    }
    
    return Math.min(100, score)
  }

  const securityScore = calculateSecurityScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }
  
  const getScoreText = (score: number) => {
    if (score >= 80) return "Dobrý"
    if (score >= 50) return "Průměrný"
    return "Špatný"
  }

  return (
    <div className="space-y-8">
      {/* Security Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bezpečnost webu</span>
            <Badge className={`${getScoreBackground(securityScore)} text-white`}>
              {securityScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* SSL Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">SSL/TLS</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  {ssl.valid ? (
                    <>
                      <ShieldCheck className="h-8 w-8 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">SSL certifikát je platný</p>
                        <p className="text-sm text-gray-500">
                          {ssl.expiryDate && `Vyprší ${ssl.expiryDate} (za ${ssl.daysToExpiry} dní)`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium">SSL certifikát není platný</p>
                        <p className="text-sm text-gray-500">
                          Web není zabezpečen pomocí HTTPS
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Security Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Stav zabezpečení</h3>
              <div className="flex items-center">
                {securityScore >= 80 ? (
                  <Lock className="h-8 w-8 text-green-500 mr-3" />
                ) : securityScore >= 50 ? (
                  <Shield className="h-8 w-8 text-amber-500 mr-3" />
                ) : (
                  <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
                )}
                <div>
                  <p className="font-medium">{getScoreText(securityScore)} stav zabezpečení</p>
                  <p className="text-sm text-gray-500">
                    {securityScore >= 80
                      ? "Web implementuje většinu doporučených bezpečnostních opatření"
                      : securityScore >= 50
                      ? "Web má průměrné zabezpečení, které lze vylepšit"
                      : "Web má nedostatečné zabezpečení a vyžaduje pozornost"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Headers */}
      <Card>
        <CardHeader>
          <CardTitle>Bezpečnostní hlavičky</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hlavička</TableHead>
                <TableHead>Hodnota</TableHead>
                <TableHead>Stav</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headers.map((header, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{header.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {header.value || <span className="text-gray-400">Nenalezeno</span>}
                  </TableCell>
                  <TableCell>
                    {header.status === "good" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Správně</span>
                      </Badge>
                    )}
                    {header.status === "warning" && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Varování</span>
                      </Badge>
                    )}
                    {header.status === "missing" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Chybí</span>
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vulnerabilities */}
      {vulnerabilities && vulnerabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Nalezené zranitelnosti</span>
              <Badge variant="destructive">{vulnerabilities.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilities.map((vuln, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  {vuln.severity === "high" && <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />}
                  {vuln.severity === "medium" && <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />}
                  {vuln.severity === "low" && <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />}
                  <div>
                    <h4 className="font-medium text-gray-900">{vuln.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{vuln.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
