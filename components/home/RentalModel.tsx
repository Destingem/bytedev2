"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, Check, Calendar, Server, RefreshCw, Wrench, Lock, LineChart, Calculator, Percent } from "lucide-react"
import Image from "next/image"

const benefits = [
  {
    icon: LineChart,
    title: "Nízké počáteční náklady",
    description: "Lepší cash flow jako u leasingu auta - neplatíte vše najednou, ale postupně v menších částkách."
  },
  {
    icon: Server,
    title: "Kompletní infrastruktura",
    description: "Hosting, doména, SSL certifikát a další technické náležitosti jsou kompletně v naší režii."
  },
  {
    icon: RefreshCw,
    title: "Neustálá modernizace",
    description: "Žádné zastaralé technologie. Web pravidelně aktualizujeme a dle domluvy i periodicky vylepšujeme."
  },
  {
    icon: Wrench,
    title: "Okamžitá podpora",
    description: "Web jsme vytvořili my, takže ho dokážeme nejrychleji opravit, bez nutnosti složitého zkoumání."
  },
  {
    icon: Lock,
    title: "Bez skrytých závazků",
    description: "Fixace jen na dobu splacení vývoje. Vlastníte svůj kód a můžete kdykoli transparentně odejít."
  }
]

export function RentalModel() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [projectCost, setProjectCost] = useState(100000)
  const [duration, setDuration] = useState(12)
  const [upfrontPercentage, setUpfrontPercentage] = useState(25)
  
  // Traditional model cost is just the project cost
  const traditionalCost = projectCost
  
  // Our model cost includes 10% markup plus monthly fees
  const totalProjectCost = projectCost * 1.1
  const monthlySubscription = 1500
  const totalRentalCost = totalProjectCost + (duration * monthlySubscription)
  
  const upfrontPayment = (totalProjectCost * upfrontPercentage) / 100
  const remainingCost = totalProjectCost - upfrontPayment
  const monthlyPayment = (remainingCost / duration) + monthlySubscription
  
  // Savings on initial payment compared to traditional model
  const savingsUpfront = traditionalCost - upfrontPayment

  // Generate better cash flow data for comparison chart
  const cashFlowData = {
    traditional: [traditionalCost, ...Array(duration - 1).fill(0)],
    rental: [upfrontPayment, ...Array(duration - 1).fill(monthlyPayment)]
  }

  // Calculate proper cumulative values
  const cumulativeCashFlow = {
    traditional: cashFlowData.traditional.reduce(
      (acc, val, idx) => {
        if (idx === 0) return [val];
        return [...acc, acc[idx - 1] + val];
      }, 
      [] as number[]
    ),
    rental: cashFlowData.rental.reduce(
      (acc, val, idx) => {
        if (idx === 0) return [val];
        return [...acc, acc[idx - 1] + val];
      }, 
      [] as number[]
    )
  }

  // Calculate the maximum value for scaling the graph
  const maxCumulativeValue = Math.max(
    ...cumulativeCashFlow.traditional,
    ...cumulativeCashFlow.rental
  )
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            <Calendar className="w-4 h-4 mr-2" />
            Inovativní přístup
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Web jako služba, <span className="text-blue-600">ne jako jednorázová investice</span>
          </h2>
          <p className="text-xl text-gray-600">
            Nechte starosti s vývojem, hostingem a údržbou na nás. Přinášíme model pronájmu webu inspirovaný leasingem vozů.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Benefits column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 space-y-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="pt-6"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Zjistit více o pronájmu webu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Comparison card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative z-10">
              {/* Decorative elements */}
              <div className="absolute -z-10 top-6 left-6 right-6 bottom-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl transform rotate-3 opacity-80" />
              <div className="absolute -z-10 top-3 left-3 right-3 bottom-3 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl transform -rotate-1 opacity-80" />
              
              {/* Card content */}
              <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-20" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-50 rounded-full opacity-20" />
                
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Porovnání modelů</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 p-5 rounded-xl">
                    <div className="text-sm uppercase text-blue-600 mb-1 font-medium">Tradiční přístup</div>
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-gray-600 text-sm">počátečních nákladů</div>
                  </div>
                  <div className="bg-green-50 p-5 rounded-xl">
                    <div className="text-sm uppercase text-green-600 mb-1 font-medium">Náš model</div>
                    <div className="text-3xl font-bold mb-2">25%</div>
                    <div className="text-gray-600 text-sm">počátečních nákladů</div>
                  </div>
                </div>
                
                <div className="relative h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Měsíc 1</span>
                    <span className="text-gray-600">Měsíc 12</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span>Vlastnictví kódu od prvního dne</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span>Možnost ukončení po splacení vývoje</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-4 cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-lg transition-all group-hover:scale-110">
                          <Calculator className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Spočítat úsporu?</div>
                          <div className="text-blue-600 text-sm group-hover:underline">Otevřít kalkulačku</div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Kalkulačka úspory</DialogTitle>
                        <DialogDescription>
                          Porovnejte tradiční model financování s naším leasingovým přístupem
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <Tabs defaultValue="calculator" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="calculator">Kalkulačka</TabsTrigger>
                            <TabsTrigger value="comparison">Graf úspory</TabsTrigger>
                          </TabsList>
                          <TabsContent value="calculator" className="space-y-6">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Celková cena projektu</label>
                              <div className="flex gap-4 items-center">
                                <Input
                                  type="number"
                                  value={projectCost}
                                  onChange={(e) => setProjectCost(Number(e.target.value))}
                                  className="text-lg"
                                />
                                <span className="text-sm text-gray-500">Kč</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Počáteční platba (%)</label>
                                <span className="text-sm font-medium">{upfrontPercentage}%</span>
                              </div>
                              <Slider 
                                value={[upfrontPercentage]}
                                onValueChange={(values) => setUpfrontPercentage(values[0])}
                                min={10}
                                max={50}
                                step={5}
                                className="mb-6"
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Doba splácení (měsíce)</label>
                                <span className="text-sm font-medium">{duration} měsíců</span>
                              </div>
                              <Slider 
                                value={[duration]}
                                onValueChange={(values) => setDuration(values[0])}
                                min={3}
                                max={24}
                                step={3}
                                className="mb-6"
                              />
                            </div>
                            
                            <div className="bg-blue-50 p-6 rounded-xl">
                              <h4 className="font-semibold mb-4 text-lg">Výsledky</h4>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-500">Tradiční model</div>
                                  <div className="text-2xl font-bold">{formatCurrency(traditionalCost)}</div>
                                  <div className="text-xs text-gray-500">jednorázová platba</div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-500">Náš model</div>
                                  <div className="text-2xl font-bold">{formatCurrency(upfrontPayment)}</div>
                                  <div className="text-xs text-gray-500">počáteční platba</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2 border-t pt-4 border-blue-200">
                                <div className="flex justify-between">
                                  <span className="text-sm">Měsíční platba:</span>
                                  <span className="font-semibold">{formatCurrency(monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Celková cena našeho modelu:</span>
                                  <span className="font-semibold">{formatCurrency(totalRentalCost)}</span>
                                </div>
                                <div className="flex justify-between text-blue-700">
                                  <span className="text-sm">Úspora na počáteční investici:</span>
                                  <span className="font-semibold">{formatCurrency(savingsUpfront)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm mt-2">
                                  <span>Zahrnuje měsíční poplatek za podporu a údržbu</span>
                                  <span>{formatCurrency(monthlySubscription)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button className="w-full" onClick={() => setDialogOpen(false)}>
                              Použít tento model
                            </Button>
                          </TabsContent>
                          
                          <TabsContent value="comparison" className="h-[400px] relative">
                            <div className="absolute inset-0 flex flex-col">
                              <h4 className="font-semibold mb-4">Srovnání cash flow</h4>
                              
                              <div className="flex-1 relative">
                                <div className="absolute bottom-0 left-0 w-full h-full flex">
                                  {/* Visualization of cash flow comparison */}
                                  <div className="relative w-full h-full">
                                    {/* Draw the axes */}
                                    <div className="absolute left-0 bottom-0 h-full w-px bg-gray-300"></div>
                                    <div className="absolute left-0 bottom-0 w-full h-px bg-gray-300"></div>
                                    
                                    {/* Cumulative cash flow lines */}
                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                      {/* Traditional model line */}
                                      <path
                                        d={`
                                          M 0,${100 - (cumulativeCashFlow.traditional[0] / maxCumulativeValue * 90)}
                                          ${cumulativeCashFlow.traditional.map((value, i) => 
                                            `L ${(i / (duration - 1)) * 100}%,${100 - (value / maxCumulativeValue * 90)}`
                                          ).join(' ')}
                                        `}
                                        fill="none"
                                        stroke="#2563EB"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                      
                                      {/* Rental model line */}
                                      <path
                                        d={`
                                          M 0,${100 - (cumulativeCashFlow.rental[0] / maxCumulativeValue * 90)}
                                          ${cumulativeCashFlow.rental.map((value, i) => 
                                            `L ${(i / (duration - 1)) * 100}%,${100 - (value / maxCumulativeValue * 90)}`
                                          ).join(' ')}
                                        `}
                                        fill="none"
                                        stroke="#22C55E"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                    </svg>
                                    
                                    {/* Monthly payment bars - Traditional model */}
                                    {cashFlowData.traditional.map((value, index) => (
                                      <div 
                                        key={`trad-${index}`} 
                                        className="absolute bottom-0 bg-blue-600 opacity-70"
                                        style={{
                                          height: `${(value / traditionalCost) * 70}%`,
                                          left: `${(index / (duration - 1)) * 100}%`,
                                          width: `${80 / duration}%`,
                                          transform: 'translateX(-50%)',
                                          maxHeight: "70%"
                                        }}
                                      />
                                    ))}
                                    
                                    {/* Monthly payment bars - Rental model */}
                                    {cashFlowData.rental.map((value, index) => (
                                      <div 
                                        key={`rental-${index}`} 
                                        className="absolute bottom-0 bg-green-500 opacity-70"
                                        style={{
                                          height: `${(value / traditionalCost) * 70}%`,
                                          left: `${(index / (duration - 1)) * 100}%`,
                                          width: `${80 / duration}%`,
                                          transform: 'translateX(-30%)',
                                          maxHeight: "70%"
                                        }}
                                      />
                                    ))}
                                    
                                    {/* Month markers */}
                                    {Array(duration).fill(0).map((_, index) => (
                                      index % Math.max(1, Math.floor(duration / 6)) === 0 && (
                                        <div 
                                          key={`marker-${index}`}
                                          className="absolute bottom-[-20px] text-xs text-gray-500"
                                          style={{
                                            left: `${(index / (duration - 1)) * 100}%`,
                                            transform: 'translateX(-50%)'
                                          }}
                                        >
                                          M{index + 1}
                                        </div>
                                      )
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-center items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                  <span>Tradiční platba</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span>Náš model</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-[2px] bg-blue-600"></div>
                                  <span>Tradiční kumulativně</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-[2px] bg-green-500"></div>
                                  <span>Náš model kumulativně</span>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
