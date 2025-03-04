import { SeoAnalysis, SeoCheck } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle, FileText, Tag, Type } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SeoAnalysisSectionProps {
  seoAnalysis: SeoAnalysis
}

export function SeoAnalysisSection({ seoAnalysis }: SeoAnalysisSectionProps) {
  const { score, metaTags, headings, contentAnalysis, checks } = seoAnalysis

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
      {/* SEO Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SEO Analýza</span>
            <Badge className={`${getProgressColor(score)} text-white`}>
              {score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* SEO Score */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Celkové SEO skóre</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600">Špatné</div>
                  <div className="text-sm text-gray-600">Výborné</div>
                </div>
                <Progress value={score} className={`h-2 ${getProgressColor(score)}`} />
              </div>
              <p className="text-sm text-gray-600">
                {score >= 80
                  ? "Web má výbornou SEO optimalizaci."
                  : score >= 50
                  ? "SEO optimalizace je dobrá, ale existuje prostor pro zlepšení."
                  : "SEO optimalizace vyžaduje významné zlepšení."}
              </p>
            </div>

            {/* Meta Tags Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Meta tagy</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Title</span>
                  </div>
                  {metaTags.title?.exists ? (
                    <Badge className={metaTags.title.issues?.length ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                      {metaTags.title.issues?.length ? "Lze vylepšit" : "OK"}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Chybí</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Description</span>
                  </div>
                  {metaTags.description?.exists ? (
                    <Badge className={metaTags.description.issues?.length ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                      {metaTags.description.issues?.length ? "Lze vylepšit" : "OK"}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Chybí</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Type className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Struktura nadpisů</span>
                  </div>
                  {headings?.structure?.valid ? (
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">Lze vylepšit</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Analysis Card */}
      {contentAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analýza obsahu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Content Stats */}
              <div>
                <div className="mb-4">
                  <div className="text-lg font-medium mb-2">Statistika obsahu</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Počet slov</div>
                      <div className="text-2xl font-bold">{contentAnalysis.wordCount}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Skóre čitelnosti</div>
                      <div className="text-2xl font-bold">{contentAnalysis.readabilityScore}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {contentAnalysis.wordCount < 300 ? (
                    "Obsah je příliš krátký. Pro dobré SEO je doporučeno minimálně 300 slov."
                  ) : contentAnalysis.wordCount < 600 ? (
                    "Obsah má dobrou délku, ale pro komplexnější témata by mohl být rozsáhlejší."
                  ) : (
                    "Obsah má optimální délku pro SEO."
                  )}
                </div>
              </div>

              {/* Keyword Analysis */}
              {contentAnalysis.keywordsFound && contentAnalysis.keywordsFound.length > 0 && (
                <div>
                  <div className="text-lg font-medium mb-2">Nalezená klíčová slova</div>
                  <div className="space-y-2">
                    {contentAnalysis.keywordsFound.slice(0, 5).map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-1">
                        <span>{keyword}</span>
                        {contentAnalysis.keywordDensity && (
                          <Badge variant="outline">
                            {(contentAnalysis.keywordDensity[keyword] * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Checks Card */}
      <Card>
        <CardHeader>
          <CardTitle>SEO kontroly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                {check.status === "passed" && <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />}
                {check.status === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />}
                {check.status === "failed" && <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />}
                <div>
                  <h4 className="font-medium text-gray-900">{check.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}