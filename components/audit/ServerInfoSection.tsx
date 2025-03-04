import { ServerInfo } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Globe, Server, Cpu } from "lucide-react"

interface ServerInfoSectionProps {
  serverInfo: ServerInfo
}

export function ServerInfoSection({ serverInfo }: ServerInfoSectionProps) {
  const { ip, server, location, dns } = serverInfo

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informace o serveru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Server className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Server</h4>
                <p className="text-gray-900 font-mono text-sm">{server || "Neznámý"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Cpu className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">IP adresa</h4>
                <p className="text-gray-900 font-mono text-sm">{ip || "Neznámá"}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Lokace</h4>
                <p className="text-gray-900">{location || "Neznámá"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">DNS</h4>
                <p className="text-gray-900 font-mono text-sm">{dns || "Neznámý"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
