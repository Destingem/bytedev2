"use client"

import { Code2, Cpu, Users, Search, Server, Globe, Mail, Briefcase } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Vývoj",
    href: "/vyvoj",
    icon: Cpu,
  },
  {
    name: "O nás",
    href: "/o-nas",
    icon: Users,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    name: "Audit",
    href: "/audit",
    icon: Search,
  },
  {
    name: "Hosting",
    href: "/hosting",
    icon: Server,
  },
  {
    name: "CDN",
    href: "/cdn",
    icon: Globe,
  },
  {
    name: "Kontakt",
    href: "/kontakt",
    icon: Mail,
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="w-[60vw] bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-sm">
        <div className="h-16 px-6 flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
            <Code2 className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">ByteDev</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive ? "text-blue-600 bg-gray-100" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50">
            <span className="sr-only">Otevřít menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

