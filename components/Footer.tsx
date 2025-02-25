import { Code2, Cpu, Users, Search, Server, Globe, Mail, Phone, MapPin, Building } from "lucide-react"
import Link from "next/link"

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

const contactInfo = [
  {
    icon: Building,
    label: "Byte development s.r.o.",
  },
  {
    icon: MapPin,
    label: "Příkop 843/4, 602 00 Brno",
    href: "https://maps.google.com",
  },
  {
    icon: Building,
    label: "IČO: 21661235",
  },
  {
    icon: Phone,
    label: "602 702 601",
    href: "tel:602702601",
  },
  {
    icon: Mail,
    label: "ondrej.zaplatilek@bytedev.cz",
    href: "mailto:ondrej.zaplatilek@bytedev.cz",
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t rounded-t-[4rem]">
      <div className="container px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ByteDev</span>
            </Link>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-600">
                  <item.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-blue-600 transition-colors"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Služby</h3>
            <div className="grid grid-cols-2 gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter/Contact CTA */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Zůstaňme v kontaktu</h3>
            <p className="text-gray-600">Sledujte nás na sociálních sítích nebo nás kontaktujte přímo.</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Byte development s.r.o. Všechna práva vyhrazena.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Ochrana osobních údajů
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Obchodní podmínky
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

