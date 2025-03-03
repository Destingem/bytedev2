"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Check, X } from "lucide-react"
import { UserCardDemo } from "./UserCardDemo"

const examples = [
  {
    title: "Moderní přístup",
    description: "Využití existujících technologií pro rychlý a efektivní vývoj",
    goodCode: `// Moderní React komponenta s Tailwind CSS
export function UserCard({ user }) {
  return (
    <div className="flex items-center p-4 bg-white 
                    rounded-xl shadow-sm hover:shadow-md 
                    transition-shadow">
      <img
        src={user.avatar}
        className="w-12 h-12 rounded-full"
      />
      <div className="ml-4">
        <h3 className="font-medium">{user.name}</h3>
        <p className="text-gray-500">{user.role}</p>
      </div>
    </div>
  )
}`,
    badCode: `<!-- Tradiční přístup s vlastním CSS -->
<div class="user-card">
  <img src="avatar.jpg" class="avatar">
  <div class="user-info">
    <h3 class="name">John Doe</h3>
    <p class="role">Developer</p>
  </div>
</div>

<style>
.user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.user-card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.user-info {
  margin-left: 16px;
}
.name {
  font-weight: 500;
}
.role {
  color: #6B7280;
}
</style>`,
    benefits: [
      "Méně kódu, větší přehlednost",
      "Standardizované řešení",
      "Snadná údržba",
      "Lepší výkon",
      "Konzistentní vzhled",
    ]
  }
]

export function SmartSolutions() {
  const [activeTab, setActiveTab] = useState<'modern' | 'legacy'>('modern')

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Chytrá řešení <span className="text-blue-600">bez zbytečností</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Proč znovu objevovat kolo? Využíváme osvědčené technologie a postupy,
            které šetří čas, peníze a přinášejí lepší výsledky.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('modern')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                  ${activeTab === 'modern' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Moderní přístup
              </button>
              <button
                onClick={() => setActiveTab('legacy')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                  ${activeTab === 'legacy' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Tradiční přístup
              </button>
            </div>

            {/* Add Demo Component */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-3">
                Výsledek:
              </div>
              <UserCardDemo variant={activeTab} />
            </div>

            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>
                {activeTab === 'modern' 
                  ? examples[0].goodCode 
                  : examples[0].badCode}
              </code>
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-4"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Výhody moderního přístupu
              </h3>
              <ul className="space-y-4">
                {examples[0].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
