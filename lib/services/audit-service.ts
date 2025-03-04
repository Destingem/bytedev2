import { parseURL } from "@/lib/utils"
import { performDetailedSeoCheck } from "@/lib/services/seo-service"
import { AuditData, KeyIssue } from '@/types/audit'

// Mock data and implementation for now - in production you'd call an actual API or use Lighthouse
export async function analyzeWebsite(url: string): Promise<Partial<AuditData>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate semi-random but consistent results based on URL
  const urlHash = simpleHash(url)
  
  // Generate base scores with some random variation but consistent for the same URL
  const getScore = (base: number) => {
    const randomVariation = (urlHash % 20) / 100
    return Math.min(1, Math.max(0, base + randomVariation))
  }
  
  const performanceScore = getScore(0.75)
  const seoScore = getScore(0.82)
  const accessibilityScore = getScore(0.68)
  const bestPracticesScore = getScore(0.85)
  
  // Generate key issues based on the lowest score areas
  const keyIssues: KeyIssue[] = []
  
  if (performanceScore < 0.7) {
    keyIssues.push({
      title: "Pomalé načítání hlavní stránky",
      description: "První vykreslení obsahu trvá více než 3 sekundy, což může odrazovat návštěvníky.",
      severity: "high"
    })
  }
  
  if (seoScore < 0.7) {
    keyIssues.push({
      title: "Chybějící meta tagy",
      description: "Některé stránky nemají vyplněné meta description, což snižuje viditelnost ve vyhledávačích.",
      severity: "medium"
    })
  }
  
  if (accessibilityScore < 0.6) {
    keyIssues.push({
      title: "Nedostatečný kontrast textu",
      description: "Některé texty mají příliš nízký kontrast vůči pozadí, což ztěžuje čtení pro některé uživatele.",
      severity: "medium"
    })
  }
  
  if (bestPracticesScore < 0.7) {
    keyIssues.push({
      title: "Zastaralé knihovny",
      description: "Web používá některé knihovny s bezpečnostními riziky, které by měly být aktualizovány.",
      severity: "high"
    })
  }
  
  return {
    performance: {
      score: performanceScore,
      audits: [
        {
          title: "First Contentful Paint",
          description: "Čas do prvního vykreslení obsahu: " + Math.round(3.5 - performanceScore * 2) + "s",
          score: performanceScore * 0.9
        },
        {
          title: "Time to Interactive",
          description: "Čas do plné interaktivity stránky: " + Math.round(6.2 - performanceScore * 3) + "s",
          score: performanceScore * 0.85
        },
        {
          title: "Velikost přenášených dat",
          description: "Celková velikost stránky: " + Math.round((1 - performanceScore) * 4 + 1) + "MB",
          score: performanceScore * 1.1 > 1 ? 1 : performanceScore * 1.1
        },
        {
          title: "Optimalizace obrázků",
          description: urlHash % 2 === 0 
            ? "Obrázky jsou dostatečně optimalizované"
            : "Některé obrázky by mohly být více komprimovány",
          score: urlHash % 2 === 0 ? 0.95 : 0.6
        }
      ]
    },
    seo: {
      score: seoScore,
      audits: [
        {
          title: "Meta tagy",
          description: seoScore > 0.7 
            ? "Meta tagy jsou správně implementovány"
            : "Některé stránky nemají vyplněné meta description",
          score: seoScore > 0.7 ? 0.9 : 0.5
        },
        {
          title: "Struktura nadpisů",
          description: urlHash % 3 === 0 
            ? "Nadpisy mají správnou hierarchickou strukturu"
            : "Struktura nadpisů není optimální",
          score: urlHash % 3 === 0 ? 0.95 : 0.7
        },
        {
          title: "Alternativní texty obrázků",
          description: seoScore > 0.75 
            ? "Většina obrázků má alternativní popisky"
            : "Mnoho obrázků nemá alternativní popisky",
          score: seoScore > 0.75 ? 0.85 : 0.4
        },
        {
          title: "Mobilní optimalizace",
          description: "Web je " + (seoScore > 0.6 ? "dobře" : "částečně") + " optimalizován pro mobilní zařízení",
          score: seoScore > 0.6 ? 0.9 : 0.65
        }
      ]
    },
    accessibility: {
      score: accessibilityScore,
      audits: [
        {
          title: "Kontrast textu",
          description: accessibilityScore > 0.7 
            ? "Textový kontrast je dostatečný pro čitelnost"
            : "Některé texty mají nedostatečný kontrast",
          score: accessibilityScore > 0.7 ? 0.9 : 0.5
        },
        {
          title: "Označení formulářových polí",
          description: urlHash % 2 === 0 
            ? "Formulářová pole mají správné popisky"
            : "Některá formulářová pole nemají popisky",
          score: urlHash % 2 === 0 ? 0.85 : 0.6
        },
        {
          title: "Keyboard navigace",
          description: accessibilityScore > 0.65 
            ? "Web lze dobře ovládat klávesnicí"
            : "Navigace klávesnicí má nedostatky",
          score: accessibilityScore > 0.65 ? 0.8 : 0.5
        },
        {
          title: "ARIA atributy",
          description: "ARIA atributy jsou " + (urlHash % 3 === 0 ? "správně" : "nesprávně") + " implementovány",
          score: urlHash % 3 === 0 ? 0.9 : 0.7
        }
      ]
    },
    bestPractices: {
      score: bestPracticesScore,
      audits: [
        {
          title: "HTTPS",
          description: "Web " + (urlHash % 2 === 0 ? "používá" : "nepoužívá") + " zabezpečené připojení",
          score: urlHash % 2 === 0 ? 1.0 : 0.0
        },
        {
          title: "Zastaralé knihovny",
          description: "Web používá některé knihovny s bezpečnostními riziky, které by měly být aktualizovány.",
          score: bestPracticesScore
        }
      ]
    },
    keyIssues
  }
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

async function fetchPerformanceData(url: string) {
  try {
    // Use PageSpeed Insights API
    const apiKey = process.env.PAGESPEED_API_KEY || ""
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`
    
    let data;
    try {
      const response = await fetch(apiUrl, { next: { revalidate: 0 } })
      if (!response.ok) {
        throw new Error(`PageSpeed API responded with status: ${response.status}`)
      }
      data = await response.json()
    } catch (apiError) {
      console.error("PageSpeed API error:", apiError)
      // Return mock data if API fails
      return getMockPerformanceData()
    }
    
    // Extract relevant metrics
    const { lighthouseResult } = data
    const categories = lighthouseResult?.categories || {}
    
    // Get scores
    const perfScore = categories.performance?.score || 0
    const accessibilityScore = categories.accessibility?.score || 0
    const bestPracticesScore = categories["best-practices"]?.score || 0
    
    // Extract Core Web Vitals
    const audits = lighthouseResult?.audits || {}
    
    const metrics = [
      {
        name: "LCP",
        value: Math.round(audits["largest-contentful-paint"]?.numericValue / 10) / 100,
        unit: "s",
        status: audits["largest-contentful-paint"]?.displayValue ? getMetricStatus("LCP", audits["largest-contentful-paint"]?.numericValue) : null
      },
      {
        name: "FID",
        value: Math.round(audits["max-potential-fid"]?.numericValue),
        unit: "ms",
        status: audits["max-potential-fid"]?.displayValue ? getMetricStatus("FID", audits["max-potential-fid"]?.numericValue) : null
      },
      {
        name: "CLS",
        value: Math.round(audits["cumulative-layout-shift"]?.numericValue * 100) / 100,
        unit: "",
        status: audits["cumulative-layout-shift"]?.displayValue ? getMetricStatus("CLS", audits["cumulative-layout-shift"]?.numericValue) : null
      },
      {
        name: "TTI",
        value: Math.round(audits["interactive"]?.numericValue / 10) / 100,
        unit: "s",
        status: audits["interactive"]?.displayValue ? getMetricStatus("TTI", audits["interactive"]?.numericValue) : null
      },
      {
        name: "Speed Index",
        value: Math.round(audits["speed-index"]?.numericValue / 10) / 100,
        unit: "s",
        status: audits["speed-index"]?.displayValue ? getMetricStatus("SI", audits["speed-index"]?.numericValue) : null
      },
      {
        name: "Total Blocking Time",
        value: Math.round(audits["total-blocking-time"]?.numericValue),
        unit: "ms",
        status: audits["total-blocking-time"]?.displayValue ? getMetricStatus("TBT", audits["total-blocking-time"]?.numericValue) : null
      }
    ]
    
    return {
      score: Math.round(perfScore * 100),
      metrics,
      accessibility: accessibilityScore,
      bestPractices: bestPracticesScore
    }
  } catch (error) {
    console.error("Performance data fetch error:", error)
    return getMockPerformanceData()
  }
}

// Mock data function for fallbacks
function getMockPerformanceData() {
  return {
    score: 72,
    metrics: [
      { name: "LCP", value: 2.8, unit: "s", status: "needs-improvement" },
      { name: "FID", value: 85, unit: "ms", status: "good" },
      { name: "CLS", value: 0.15, unit: "", status: "needs-improvement" },
      { name: "TTI", value: 4.2, unit: "s", status: "needs-improvement" },
      { name: "Speed Index", value: 3.7, unit: "s", status: "needs-improvement" },
      { name: "Total Blocking Time", value: 320, unit: "ms", status: "needs-improvement" }
    ],
    accessibility: 0.84,
    bestPractices: 0.79
  }
}

function getMetricStatus(metric: string, value: number) {
  switch (metric) {
    case "LCP":
      return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor"
    case "FID":
      return value <= 100 ? "good" : value <= 300 ? "needs-improvement" : "poor"
    case "CLS":
      return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor"
    case "TTI":
      return value <= 3800 ? "good" : value <= 7300 ? "needs-improvement" : "poor"
    case "SI":
      return value <= 3400 ? "good" : value <= 5800 ? "needs-improvement" : "poor"
    case "TBT":
      return value <= 200 ? "good" : value <= 600 ? "needs-improvement" : "poor"
    default:
      return "unknown"
  }
}

async function fetchSeoData(url: string) {
  try {
    // Fetch HTML content to analyze
    const response = await fetch(url)
    const html = await response.text()
    
    // Use enhanced SEO service with correct parameters
    return await performDetailedSeoCheck(url, html)
  } catch (error) {
    console.error("SEO data fetch error:", error)
    return {
      score: 0,
      checks: []
    }
  }
}

async function fetchTechStackData(url: string) {
  try {
    // This would typically use a service like Wappalyzer API
    // For demo purposes, we'll simulate a response
    const response = await fetch(url)
    const html = await response.text()
    
    // Simple tech detection based on HTML content
    const technologies = []
    
    if (/<script[^>]*react/.test(html)) technologies.push({ name: "React" })
    if (/<script[^>]*next/.test(html)) technologies.push({ name: "Next.js" })
    if (/<script[^>]*vue/.test(html)) technologies.push({ name: "Vue.js" })
    if (/<script[^>]*angular/.test(html)) technologies.push({ name: "Angular" })
    if (/<link[^>]*bootstrap/.test(html)) technologies.push({ name: "Bootstrap" })
    if (/<link[^>]*tailwind/.test(html)) technologies.push({ name: "Tailwind CSS" })
    if (/wordpress/i.test(html)) technologies.push({ name: "WordPress" })
    if (/shopify/i.test(html)) technologies.push({ name: "Shopify" })
    if (/woocommerce/i.test(html)) technologies.push({ name: "WooCommerce" })
    if (/jquery/i.test(html)) technologies.push({ name: "jQuery" })
    if (/analytics/i.test(html)) technologies.push({ name: "Google Analytics" })
    if (/gtm/i.test(html)) technologies.push({ name: "Google Tag Manager" })
    
    // Return detected technologies or fallback to basic web technologies
    return technologies.length > 0 ? technologies : [
      { name: "HTML5" },
      { name: "CSS" },
      { name: "JavaScript" }
    ]
  } catch (error) {
    console.error("Tech stack detection error:", error)
    return [
      { name: "HTML5" },
      { name: "CSS" },
      { name: "JavaScript" }
    ]
  }
}

async function fetchServerInfo(hostname: string, url: string) {
  try {
    // Use a third-party service or API for server info instead of direct DNS lookups
    // For now, we'll use a simpler approach by extracting info from the response headers
    const response = await fetch(url)
    const headers = Object.fromEntries(response.headers)
    
    // Extract server info from headers
    const server = headers["server"] || "Unknown"
    
    return {
      ip: "Unknown (requires server-side lookup)",
      server,
      location: "Unknown (requires geolocation API)",
      dns: hostname
    }
  } catch (error) {
    console.error("Server info fetch error:", error)
    return {
      ip: "Unknown",
      server: "Unknown",
      location: "Unknown",
      dns: hostname
    }
  }
}