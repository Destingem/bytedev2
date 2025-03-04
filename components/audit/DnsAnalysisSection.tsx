import { DnsAnalysis, DnsRecord } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DnsAnalysisSectionProps {
  dnsAnalysis: DnsAnalysis
}

export function DnsAnalysisSection({ dnsAnalysis }: DnsAnalysisSectionProps) {
  const { records, issues } = dnsAnalysis

  // Group records by type
  const recordsByType = records.reduce((acc, record) => {
    if (!acc[record.type]) {
      acc[record.type] = []
    }
    acc[record.type].push(record)
    return acc
  }, {} as Record<string, DnsRecord[]>)

  // Order of record types to display
  const recordTypeOrder = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "SRV", "CAA", "PTR", "DNSKEY", "DS"]

  // Sort record types according to the preferred order
  const sortedRecordTypes = Object.keys(recordsByType).sort(
    (a, b) => {
      const indexA = recordTypeOrder.indexOf(a)
      const indexB = recordTypeOrder.indexOf(b)
      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    }
  )

  return (
    <div className="space-y-8">
      {/* DNS Records Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>DNS záznamy</span>
            <Badge variant="outline" className="text-blue-600 bg-blue-50">
              {records.length} záznamů
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <>
              {sortedRecordTypes.map((type) => (
                <div key={type} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                    <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{type}</Badge>
                    <span>záznamy</span>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Název</TableHead>
                        <TableHead>Hodnota</TableHead>
                        <TableHead>TTL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recordsByType[type].map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{record.name}</TableCell>
                          <TableCell className="font-mono text-sm">{record.value}</TableCell>
                          <TableCell>{record.ttl}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Info className="mr-2 h-4 w-4" />
              <span>Žádné DNS záznamy nebyly nalezeny</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Issues Section */}
      {issues && issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nalezené problémy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  {issue.severity === "high" && <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />}
                  {issue.severity === "medium" && <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />}
                  {issue.severity === "low" && <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {issue.severity === "high" && "Kritický problém"}
                      {issue.severity === "medium" && "Střední problém"}
                      {issue.severity === "low" && "Nízká priorita"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
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
