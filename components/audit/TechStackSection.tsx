import { Technology } from "@/types/audit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, Server } from "lucide-react"

interface TechStackSectionProps {
  techStack: Technology[]
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
  // Make sure we have an array to work with
  const technologies = Array.isArray(techStack) ? techStack : [];
  
  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    const category = tech.category || "Ostatní"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(tech)
    return acc
  }, {} as Record<string, Technology[]>)
  
  // Default categories and their order
  const categoryOrder = [
    "Frontend",
    "Backend",
    "Framework",
    "CMS",
    "Ecommerce",
    "Analytics",
    "Ads",
    "Hosting",
    "Server",
    "Ostatní"
  ]

  // Sort categories according to the preferred order
  const sortedCategories = Object.keys(groupedTechnologies).sort(
    (a, b) => {
      const indexA = categoryOrder.indexOf(a)
      const indexB = categoryOrder.indexOf(b)
      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    }
  )

  // Icon mapping for categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <Globe className="h-5 w-5" />
      case "backend":
        return <Server className="h-5 w-5" />
      case "database":
        return <Database className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Technologie</span>
          <Badge variant="outline" className="text-blue-600 bg-blue-50">
            {technologies.length} technologií
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {technologies.length > 0 ? (
          <div className="space-y-6">
            {sortedCategories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedTechnologies[category].map((tech, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="text-gray-700 bg-gray-50 hover:bg-gray-100 py-2"
                    >
                      {tech.name}
                      {tech.version && <span className="text-gray-500 ml-1 text-sm">v{tech.version}</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Server className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nepodařilo se detekovat žádné technologie</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
