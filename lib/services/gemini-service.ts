import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiRecommendation } from '@/types/audit';

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.0-flash-lite-preview-02-05"; // Updated model name to the current version

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: MODEL_NAME,
  generationConfig: {
    temperature: 0.4,
    topP: 0.8,
    topK: 40,
  }
});

export async function generateAiReport(auditData: any): Promise<AiRecommendation> {
  try {
    // Try to use Gemini API if available, otherwise fallback to local generation
    if (API_KEY) {
      const prompt = createEnhancedAuditPrompt(auditData);
      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Extract JSON from the response
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/{[\s\S]*?}/);
        
        if (jsonMatch) {
          try {
            const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            if (parsedData.summary && Array.isArray(parsedData.priorities)) {
              return parsedData;
            }
          } catch (jsonError) {
            console.error("Error parsing AI response:", jsonError);
          }
        }
      } catch (apiError) {
        console.error("Gemini API error:", apiError);
      }
    }
  } catch (error) {
    console.error("Error in AI report generation:", error);
  }
  
  // Fallback to enhanced local generation if API fails or is not available
  return generateEnhancedLocalRecommendations(auditData);
}

// Enhanced local recommendation generation
function generateEnhancedLocalRecommendations(auditData: any): AiRecommendation {
  // Extract scores and other data
  const scores = {
    performance: auditData.performance?.score || 0,
    seo: auditData.seo?.score || 0,
    accessibility: auditData.accessibility?.score || 0,
    bestPractices: auditData.bestPractices?.score || 0
  };
  
  const domain = new URL(auditData.url).hostname;
  const hasHttps = auditData.securityInfo?.ssl?.valid || false;
  const techStack = Array.isArray(auditData.techStack) ? auditData.techStack : [];
  const hasCmsSystem = techStack.some(tech => tech.category === 'CMS' || tech.name === 'WordPress');
  const serverInfo = auditData.serverInfo || {};
  
  // Find the weakest areas
  const priorities = [];
  const areas: Array<{ key: string, name: string, score: number, importance: number }> = [
    { key: 'performance', name: 'Výkon webu', score: scores.performance, importance: 1.0 },
    { key: 'seo', name: 'SEO optimalizace', score: scores.seo, importance: 0.9 },
    { key: 'accessibility', name: 'Přístupnost', score: scores.accessibility, importance: 0.8 },
    { key: 'bestPractices', name: 'Best practices', score: scores.bestPractices, importance: 0.7 }
  ];

  // Custom scoring that considers both score and importance
  const sortedAreas = [...areas].sort((a, b) => 
    (a.score * a.importance) - (b.score * b.importance)
  );

  // Generate detailed, practical recommendations for the top issues
  for (const area of sortedAreas) {
    if (area.key === 'performance' && area.score < 0.8) {
      const perfIssue = {
        title: 'Optimalizujte rychlost načítání',
        description: `Váš web se načítá pomaleji než je optimální (skóre: ${Math.round(area.score * 100)}/100). `
      };
      
      // Add more detailed advice based on the score
      if (area.score < 0.5) {
        perfIssue.description += 'Doporučujeme implementovat: lazy loading pro obrázky, minifikaci CSS/JS souborů, využití CDN pro statický obsah a optimalizaci velikosti obrázků (WebP formát).';
      } else {
        perfIssue.description += 'Zvažte implementaci: cachování v prohlížeči, optimalizaci kritické cesty renderování a předběžné načítání klíčových zdrojů.';
      }
      
      priorities.push(perfIssue);
    }
    
    if (area.key === 'seo' && area.score < 0.8) {
      const seoMetaIssues = auditData.seoAnalysis?.metaTags || {};
      const hasMetaIssues = seoMetaIssues.title?.issues?.length > 0 || 
                           seoMetaIssues.description?.issues?.length > 0;
      
      const seoIssue = {
        title: 'Vylepšete SEO strategii',
        description: `Vaše SEO skóre ${Math.round(area.score * 100)}/100 indikuje prostor pro zlepšení. `
      };
      
      if (hasMetaIssues) {
        seoIssue.description += 'Zaměřte se na: optimalizaci meta tagů, vytvoření strukturovaných dat (JSON-LD) a zlepšení hierarchie nadpisů.';
      } else {
        seoIssue.description += `Doporučujeme: vytvořit kvalitní zpětné odkazy, optimalizovat obsah pro klíčová slova relevantní pro ${domain} a zlepšit interní prolinkování webu.`;
      }
      
      priorities.push(seoIssue);
    }
    
    if (area.key === 'accessibility' && area.score < 0.8) {
      priorities.push({
        title: 'Zajistěte inkluzivní webové prostředí',
        description: `Přístupnost vašeho webu je na úrovni ${Math.round(area.score * 100)}/100. Implementujte: správné ARIA atributy, dostatečný barevný kontrast (min. 4.5:1), ovladatelnost klávesnicí a alternativní texty ke všem obrázkům. Toto zlepší uživatelský zážitek a rozšíří vaši cílovou skupinu.`
      });
    }
    
    if (area.key === 'bestPractices' && area.score < 0.8) {
      const bpIssue = {
        title: 'Modernizujte technické základy webu',
        description: ''
      };
      
      if (!hasHttps) {
        bpIssue.description = 'Prioritně implementujte HTTPS zabezpečení pro zvýšení důvěryhodnosti a ochranu dat uživatelů. ';
      }
      
      bpIssue.description += `Aktualizujte zastaralé knihovny, implementujte bezpečnostní hlavičky (CSP, X-Frame-Options) a optimalizujte ošetření chyb pro lepší uživatelskou zkušenost. Tyto změny nejen zvýší bezpečnost, ale také přispějí k lepšímu hodnocení ve vyhledávačích.`;
      
      priorities.push(bpIssue);
    }
    
    // Add specific advice for server or technology if we have that data
    if (priorities.length < 4) {
      if (hasCmsSystem) {
        const cmsSystem = techStack.find(tech => tech.category === 'CMS' || tech.name === 'WordPress');
        priorities.push({
          title: `Optimalizujte ${cmsSystem?.name || 'CMS'} pro maximální výkon`,
          description: `Jako webová vývojářská společnost doporučujeme: odstranit nepoužívané pluginy, implementovat cachování na úrovni serveru, optimalizovat databázové dotazy a zvážit prémiové hostingové řešení zaměřené na ${cmsSystem?.name || 'vaše CMS'}.`
        });
      } else if (serverInfo.server) {
        priorities.push({
          title: 'Vylepšete serverovou konfiguraci',
          description: `Váš server (${serverInfo.server}) by mohl těžit z: implementace HTTP/2, správného nastavení komprese (Gzip/Brotli), optimalizace TTL pro statické soubory a implementace CDN pro geograficky distribuovaný obsah.`
        });
      }
    }
    
    // Limit to top 4 priorities for more comprehensive advice
    if (priorities.length >= 4) break;
  }

  // Add specific call-to-action at the end
  if (priorities.length === 0) {
    priorities.push({
      title: 'Konzultace pro další vylepšení webu',
      description: 'Váš web je v dobré kondici! Pro další optimalizaci a udržení náskoku před konkurencí vám nabízíme odbornou konzultaci. Naši vývojáři dokáží identifikovat další příležitosti pro zlepšení, které pomohou vašemu podnikání růst.'
    });
  }

  // Generate detailed summary with more business context
  let summary = '';
  const avgScore = (scores.performance + scores.seo + scores.accessibility + scores.bestPractices) / 4;
  const scorePercentage = Math.round(avgScore * 100);
  
  if (avgScore > 0.8) {
    summary = `Váš web ${domain} dosahuje nadprůměrných výsledků s celkovým skóre ${scorePercentage}/100. Gratulujeme! Přesto existují oblasti, kde můžete získat konkurenční výhodu. Implementací našich doporučení můžete dále zlepšit uživatelskou zkušenost, konverzní poměr a viditelnost ve vyhledávačích.`;
  } else if (avgScore > 0.6) {
    summary = `Web ${domain} má solidní základ se skóre ${scorePercentage}/100, ale existují významné příležitosti ke zlepšení. Naše analýza identifikovala klíčové oblasti, jejichž optimalizace povede k lepším obchodním výsledkům, vyšší spokojenosti uživatelů a lepším pozicím ve vyhledávačích.`;
  } else {
    summary = `Web ${domain} má skóre ${scorePercentage}/100, což indikuje prostor pro zásadní vylepšení. Implementací našich doporučení můžete výrazně zlepšit výkon, použitelnost a viditelnost vašeho webu. Jako zkušení webový vývojáři víme, že tyto změny mohou vést až k 30% nárůstu konverzí a významně lepším pozicím ve vyhledávačích.`;
  }

  return {
    summary,
    priorities
  };
}

function createEnhancedAuditPrompt(auditData: any) {
  const domain = new URL(auditData.url).hostname;
  const hasHttps = auditData.securityInfo?.ssl?.valid || false;
  const techStack = Array.isArray(auditData.techStack) ? auditData.techStack : [];
  const hasCmsSystem = techStack.some(tech => tech.category === 'CMS' || tech.name === 'WordPress');
  const serverInfo = auditData.serverInfo || {};
  
  return `
    Jsi expertní webový konzultant pracující ve webové vývojářské společnosti. Analyzuj následující data z auditu webu a vytvoř profesionální, detailní shrnutí a seznam 3-5 prioritních doporučení pro potenciálního klienta.
    
    Odpověz ve formátu JSON s klíči "summary" a "priorities", kde priorities je pole objektů s klíči "title" a "description".
    
    URL webu: ${auditData.url}
    
    TECHNICKÁ DATA Z AUDITU:
    Performance skóre: ${auditData.performance?.score || 0}
    SEO skóre: ${auditData.seo?.score || 0}
    Accessibility skóre: ${auditData.accessibility?.score || 0}
    Best Practices skóre: ${auditData.bestPractices?.score || 0}
    
    Performance metriky: ${JSON.stringify(auditData.performance?.metrics || {})}
    SEO analýza: ${JSON.stringify(auditData.seoAnalysis || {})}
    Zabezpečení: ${JSON.stringify(auditData.securityInfo || {})}
    Technologie: ${JSON.stringify(auditData.techStack || [])}
    Server: ${JSON.stringify(auditData.serverInfo || {})}
    DNS záznamy: ${JSON.stringify(auditData.dnsAnalysis?.records || [])}
    
    POKYNY PRO GENEROVÁNÍ:
    1. Vytvoř obchodně orientované shrnutí, které vysvětluje, proč jsou tato vylepšení důležitá pro úspěch webu ${domain}
    2. Zaměř se na to, jak doporučení mohou zlepšit konverzní poměr, uživatelskou zkušenost a pozice ve vyhledávačích
    3. Poskytni podrobná, implementačně specifická doporučení, ne obecné rady
    4. Prezentuj se jako expert na webový vývoj, který dokáže tyto problémy řešit
    5. Piš v češtině, profesionálním tónem zaměřeným na byznyspotřeby klienta
    6. Přidej lehký prodejní důraz, ale bez přehnaného nátlaku
    
    Příklad vysoce kvalitního doporučení:
    "Optimalizujte kritickou cestu renderování: LCP hodnota 3.5s je horší než doporučených 2.5s. Implementujte přednostní načítání kritických CSS, použijte techniku preconnect pro externí domény a odložte načítání skriptů třetích stran. Pro WordPress doporučujeme plugin WP Rocket s odděleným nastavením desktopových a mobilních optimalizací."
    
    Výstup by měl být v následujícím JSON formátu:
    \`\`\`json
    {
      "summary": "profesionální shrnutí s důrazem na obchodní přínosy optimalizace",
      "priorities": [
        {
          "title": "konkrétní, akční název priority 1",
          "description": "detailní, implementačně specifické doporučení s jasnou hodnotou pro byznys"
        },
        // ...další priority
      ]
    }
    \`\`\`
  `;
}

function getMockRecommendations(auditData: any) {
  const performanceScore = auditData.performance.score;
  const seoScore = auditData.seo.score;
  
  return {
    summary: `Váš web dosahuje výkonu ${performanceScore}/100 a SEO skóre ${seoScore}/100. Existují oblasti, které je třeba zlepšit pro lepší uživatelskou zkušenost a viditelnost ve vyhledávačích.`,
    priorities: [
      {
        title: "Optimalizace rychlosti načítání",
        description: "Zmenšete velikost obrázků a implementujte lazy loading pro zlepšení LCP a Core Web Vitals metrik."
      },
      {
        title: "Vylepšení SEO metadat",
        description: "Doplňte chybějící meta tagy a zajistěte správnou strukturu nadpisů pro lepší indexování."
      },
      {
        title: "Mobilní optimalizace",
        description: "Zajistěte responzivní design a optimalizujte obsah pro mobilní zařízení."
      },
      {
        title: "Zabezpečení webu",
        description: "Implementujte HTTPS a aktualizujte zastaralé knihovny pro zvýšení bezpečnosti."
      }
    ]
  };
}
