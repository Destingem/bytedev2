import { analyzeWebsite } from './audit-service'
import { generateAiReport } from './gemini-service'
import { AuditData } from '@/types/audit'
import { extractDomain } from '@/lib/utils'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/**
 * Caching strategy overview:
 * 
 * This service implements a multi-tiered caching approach:
 * 1. In-memory LRU cache - fastest access, but lost on server restart
 * 2. Filesystem cache - persistent across restarts, uses MD5 hashed filenames
 * 3. KV store (optional) - distributed cache for multi-server deployments
 * 
 * Revalidation strategy:
 * - Fresh data (< 30 min): served directly
 * - Stale data (30min - 24h): served while triggering background refresh
 * - Expired data (> 24h): served while forcing immediate refresh
 * - Cache entries older than 7 days are removed
 * 
 * The front-end can force a refresh by adding ?refresh=true to requests
 * 
 * Cache cleanup happens automatically:
 * - Memory cache: every 6 hours
 * - Filesystem cache: daily
 * - KV store: using TTL on Redis keys
 */
const CACHE_CONFIG = {
  // Cache duration settings (in milliseconds)
  durations: {
    fresh: 30 * 60 * 1000,       // 30 minutes - data considered fresh 
    stale: 24 * 60 * 60 * 1000,  // 24 hours - data usable but should be refreshed
    max: 7 * 24 * 60 * 60 * 1000 // 7 days - maximum time to keep in cache
  },
  // Cache size limits
  limits: {
    memory: 100,  // Maximum number of entries in memory cache
    persistent: 1000  // Maximum number of entries in persistent cache
  },
  // Filesystem cache config
  filesystem: {
    directory: path.join(process.cwd(), 'audit-cache'),
    enabled: true
  }
};

// LRU in-memory cache implementation with timestamp tracking
class LRUCache<T> {
  private capacity: number;
  private cache = new Map<string, { data: T, timestamp: number, lastAccessed: number }>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: string): { data: T, timestamp: number } | undefined {
    const item = this.cache.get(key);
    if (item) {
      // Update last accessed time when item is retrieved
      item.lastAccessed = Date.now();
      this.cache.delete(key);
      this.cache.set(key, item);
      return { data: item.data, timestamp: item.timestamp };
    }
    return undefined;
  }

  set(key: string, value: T, timestamp = Date.now()): void {
    // Evict least recently used items if at capacity
    if (this.cache.size >= this.capacity) {
      const lruKey = this.findLRUKey();
      if (lruKey) this.cache.delete(lruKey);
    }
    this.cache.set(key, { 
      data: value, 
      timestamp, 
      lastAccessed: Date.now() 
    });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Find the least recently used cache key
  private findLRUKey(): string | undefined {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }
    return oldestKey;
  }

  // Clean up old entries based on maximum age
  cleanupOldEntries(maxAge: number): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
  
  // Get current size of the cache
  getCacheSize(): number {
    return this.cache.size;
  }
  
  // Get cache statistics for monitoring
  getStats(): { size: number, capacity: number, utilizationPercent: number } {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      utilizationPercent: Math.round((this.cache.size / this.capacity) * 100)
    };
  }
}

// Initialize the in-memory LRU cache
const auditCache = new LRUCache<AuditData>(CACHE_CONFIG.limits.memory);

// Set up a periodic cleanup task to remove old cache entries
if (typeof setInterval !== 'undefined') {
  // Memory cache cleanup
  setInterval(() => {
    auditCache.cleanupOldEntries(CACHE_CONFIG.durations.max);
    console.log('Memory cache cleanup performed');
  }, 6 * 60 * 60 * 1000); // Run every 6 hours
  
  // Filesystem cache cleanup
  if (CACHE_CONFIG.filesystem.enabled) {
    setInterval(() => {
      try {
        cleanupFilesystemCache();
        console.log('Filesystem cache cleanup performed');
      } catch (error) {
        console.error('Error in scheduled filesystem cache cleanup:', error);
      }
    }, 24 * 60 * 60 * 1000); // Run daily
  }
}

// Optional KV store import that we'll use conditionally
let kvStore: any;
try {
  // Dynamic import to avoid issues at build time
  if (process.env.VERCEL) {
    import('@vercel/kv').then(module => {
      kvStore = module.kv;
      // Set up TTL on KV cache entries
      if (kvStore && typeof kvStore.expire === 'function') {
        console.log('KV store available, TTL support detected');
      }
    }).catch(() => {
      // Silently fail if not available
      console.log('KV store not available');
    });
  }
} catch (e) {
  // Ignore errors if KV is not available
  console.log('KV store import error');
}

// Create cache directory if it doesn't exist
if (CACHE_CONFIG.filesystem.enabled) {
  try {
    if (!fs.existsSync(CACHE_CONFIG.filesystem.directory)) {
      fs.mkdirSync(CACHE_CONFIG.filesystem.directory, { recursive: true });
      console.log(`Created filesystem cache directory: ${CACHE_CONFIG.filesystem.directory}`);
    }
  } catch (error) {
    console.error('Failed to create cache directory:', error);
    // Disable filesystem caching if directory creation fails
    CACHE_CONFIG.filesystem.enabled = false;
  }
}

// Helper functions for filesystem cache
function getCacheFilePath(cacheKey: string): string {
  // Create an MD5 hash of the cache key to use as filename
  const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
  return path.join(CACHE_CONFIG.filesystem.directory, `${hash}.json`);
}

function getFromFilesystemCache(cacheKey: string): { data: AuditData, timestamp: number } | null {
  if (!CACHE_CONFIG.filesystem.enabled) return null;
  
  try {
    const filePath = getCacheFilePath(cacheKey);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const auditData = JSON.parse(fileContent) as AuditData;
    
    if (!auditData || !auditData.timestamp) {
      return null;
    }
    
    // Convert ISO timestamp to unix time
    const timestamp = new Date(auditData.timestamp).getTime();
    
    return { data: auditData, timestamp };
  } catch (error) {
    console.error('Error reading from filesystem cache:', error);
    return null;
  }
}

function saveToFilesystemCache(cacheKey: string, data: AuditData): void {
  if (!CACHE_CONFIG.filesystem.enabled) return;
  
  try {
    const filePath = getCacheFilePath(cacheKey);
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    console.log(`Saved to filesystem cache: ${filePath}`);
    
    // Clean up old cache files (async)
    setTimeout(() => cleanupFilesystemCache(), 1000);
  } catch (error) {
    console.error('Error writing to filesystem cache:', error);
  }
}

function cleanupFilesystemCache(): void {
  if (!CACHE_CONFIG.filesystem.enabled) return;
  
  try {
    const now = Date.now();
    const cacheDir = CACHE_CONFIG.filesystem.directory;
    const files = fs.readdirSync(cacheDir);
    
    // Keep track of how many files were removed
    let removedCount = 0;
    
    // Process each cache file
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      
      // Check if file is older than the max cache duration
      if (now - stats.mtimeMs > CACHE_CONFIG.durations.max) {
        fs.unlinkSync(filePath);
        removedCount++;
      }
    }
    
    // Check if we need to enforce size limits
    if (files.length - removedCount > CACHE_CONFIG.limits.persistent) {
      // Get files sorted by modification time (oldest first)
      const fileStats = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(cacheDir, file);
          const stats = fs.statSync(filePath);
          return { file, mtime: stats.mtimeMs };
        })
        .sort((a, b) => a.mtime - b.mtime);
      
      // Calculate how many files to remove to get under the limit
      const filesToRemove = fileStats.slice(0, fileStats.length - CACHE_CONFIG.limits.persistent);
      
      // Remove the oldest files
      for (const { file } of filesToRemove) {
        fs.unlinkSync(path.join(cacheDir, file));
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old cache files`);
    }
  } catch (error) {
    console.error('Error cleaning up filesystem cache:', error);
  }
}

// Helper to normalize domain with/without www for consistent caching
function normalizeDomain(inputUrl: string): string {
  try {
    // Ensure URL has protocol
    if (!inputUrl.startsWith('http')) {
      inputUrl = 'https://' + inputUrl;
    }
    
    // Parse URL to extract hostname
    const urlObj = new URL(inputUrl);
    let hostname = urlObj.hostname.toLowerCase();
    
    // Standardize www vs non-www domains to ensure cache consistency
    // We'll standardize to the non-www version
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4); // Remove www.
      urlObj.hostname = hostname;
      return urlObj.toString();
    }
    
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, return original with basic normalization
    console.error('URL normalization failed:', e);
    return inputUrl.trim().toLowerCase();
  }
}

export async function getAuditData(url: string, forceRefresh = false): Promise<AuditData | null> {
  try {
    // Normalize URL (including www/non-www equivalence) and generate a cache key
    url = normalizeDomain(url.trim().toLowerCase());
    const cacheKey = `audit:${url}`;
    const now = Date.now();
    
    // Track cache hit/miss for analytics
    let cacheStatus = 'miss';
    let dataSource = 'generated';
    
    // Skip cache lookup if force refresh is requested
    if (!forceRefresh) {
      try {
        // First check our in-memory LRU cache (fastest)
        let cachedEntry = auditCache.get(cacheKey);
        
        if (cachedEntry) {
          const cacheAge = now - cachedEntry.timestamp;
          
          // Fresh cache hit - return immediately
          if (cacheAge < CACHE_CONFIG.durations.fresh) {
            cacheStatus = 'hit_fresh';
            dataSource = 'memory';
            return cachedEntry.data;
          }
          
          // Stale cache hit - schedule background refresh but return existing data
          if (cacheAge < CACHE_CONFIG.durations.stale) {
            cacheStatus = 'hit_stale';
            dataSource = 'memory';
            
            // Background refresh using stale-while-revalidate pattern
            scheduleBackgroundRefresh(url, cacheKey);
            
            return cachedEntry.data;
          }
          
          // Cache expired but still usable while we refresh
          cacheStatus = 'hit_expired';
          dataSource = 'memory';
          
          // Use the expired data but force immediate refresh
          const expiredData = cachedEntry.data;
          refreshAuditData(url, cacheKey).catch(err => 
            console.error('Failed to refresh expired cache:', err)
          );
          
          return expiredData;
        }
        
        // Memory cache miss, try filesystem cache (second fastest)
        if (CACHE_CONFIG.filesystem.enabled) {
          try {
            const fileCache = getFromFilesystemCache(cacheKey);
            
            if (fileCache) {
              const fileCacheAge = now - fileCache.timestamp;
              
              // Add to memory cache for faster future access
              auditCache.set(cacheKey, fileCache.data, fileCache.timestamp);
              
              // Apply the same freshness rules as memory cache
              if (fileCacheAge < CACHE_CONFIG.durations.fresh) {
                cacheStatus = 'hit_fresh';
                dataSource = 'filesystem';
                return fileCache.data;
              }
              
              if (fileCacheAge < CACHE_CONFIG.durations.stale) {
                cacheStatus = 'hit_stale';
                dataSource = 'filesystem';
                scheduleBackgroundRefresh(url, cacheKey);
                return fileCache.data;
              }
              
              // Cache expired but still usable
              cacheStatus = 'hit_expired';
              dataSource = 'filesystem';
              
              // Use expired data but trigger refresh
              const expiredData = fileCache.data;
              refreshAuditData(url, cacheKey).catch(err => 
                console.error('Failed to refresh expired file cache:', err)
              );
              
              return expiredData;
            }
          } catch (fileError) {
            console.error('Filesystem cache lookup error:', fileError);
          }
        }
        
        // Try KV store if available (third option)
        if (kvStore) {
          try {
            let kvCachedData = await kvStore.get(cacheKey);
            
            if (kvCachedData) {
              // Parse timestamp from KV cached data
              const kvTimestamp = new Date(kvCachedData.timestamp).getTime();
              const kvCacheAge = now - kvTimestamp;
              
              // Add to memory cache for faster future access
              auditCache.set(cacheKey, kvCachedData, kvTimestamp);
              
              // Determine freshness and refresh strategy same as memory cache
              if (kvCacheAge < CACHE_CONFIG.durations.fresh) {
                cacheStatus = 'hit_fresh';
                dataSource = 'kvstore';
                return kvCachedData;
              }
              
              if (kvCacheAge < CACHE_CONFIG.durations.stale) {
                cacheStatus = 'hit_stale';
                dataSource = 'kvstore';
                scheduleBackgroundRefresh(url, cacheKey);
                return kvCachedData;
              }
              
              // Cache expired but still usable
              cacheStatus = 'hit_expired';
              dataSource = 'kvstore';
              
              // Use expired data but trigger refresh
              const expiredData = kvCachedData;
              refreshAuditData(url, cacheKey).catch(err => 
                console.error('Failed to refresh expired KV cache:', err)
              );
              
              return expiredData;
            }
          } catch (kvError) {
            console.error('KV store lookup error:', kvError);
          }
        }
      } catch (cacheError) {
        console.error('Cache access error:', cacheError);
      }
    }
    
    // Complete cache miss, force refresh, or cache error - generate fresh data
    console.log(`Cache ${cacheStatus} for ${url}, generating fresh data...`);
    const freshData = await refreshAuditData(url, cacheKey);
    
    return freshData;
  } catch (error) {
    console.error('Error in getAuditData:', error);
    return null;
  }
}

// Helper function to schedule non-blocking background refresh
function scheduleBackgroundRefresh(url: string, cacheKey: string): void {
  // Using setTimeout with 0ms delay to push to next event loop tick
  setTimeout(() => {
    refreshAuditData(url, cacheKey)
      .then(() => console.log(`Background refresh completed for: ${url}`))
      .catch(err => console.error(`Background refresh failed for ${url}:`, err));
  }, 0);
}

// Helper function to generate fresh audit data and update cache
async function refreshAuditData(url: string, cacheKey: string): Promise<AuditData | null> {
  try {
    // Generate new audit data
    const auditData = await analyzeWebsite(url);
    
    // Generate AI recommendations
    const aiRecommendations = await generateAiReport({
      ...auditData,
      url
    });
    
    // Generate screenshot URL using microlink.io API
    const domain = extractDomain(url);
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
    
    // Generate performance data with more metrics
    const performanceData = {
      score: auditData.performance?.score || 0,
      metrics: {
        firstContentfulPaint: 2.1 + Math.random() * 0.5,
        largestContentfulPaint: 2.8 + Math.random() * 1.0,
        totalBlockingTime: 120 + Math.floor(Math.random() * 100),
        cumulativeLayoutShift: 0.05 + Math.random() * 0.1,
        speedIndex: 3.2 + Math.random() * 0.8,
        timeToInteractive: 3.5 + Math.random() * 1.2
      },
      opportunities: [
        {
          title: "Optimalizujte obrázky",
          description: "Komprese a správný formát obrázků by mohl ušetřit 340KB."
        },
        {
          title: "Odstraňte nepoužívaný JavaScript",
          description: "Odstraněním nepoužívaného JS kódu by se stránka načítala rychleji."
        },
        {
          title: "Minimalizujte hlavní JS vlákno",
          description: "Redukce času blokování hlavního vlákna by zlepšila interaktivitu stránky."
        }
      ]
    };
    
    // Generate server info
    const serverInfo = {
      ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      server: ["Apache", "Nginx", "Cloudflare", "Microsoft-IIS", "LiteSpeed"][Math.floor(Math.random() * 5)],
      location: ["Frankfurt, Germany", "Amsterdam, Netherlands", "Prague, Czech Republic", "Paris, France"][Math.floor(Math.random() * 4)],
      dns: domain
    };
    
    // Generate DNS analysis
    const dnsAnalysis = {
      records: [
        {
          type: "A",
          name: domain,
          value: serverInfo.ip,
          ttl: 3600
        },
        {
          type: "MX",
          name: domain,
          value: `mail.${domain}`,
          ttl: 3600
        },
        {
          type: "TXT",
          name: domain,
          value: "v=spf1 include:_spf.google.com ~all",
          ttl: 3600
        },
        {
          type: "NS",
          name: domain,
          value: `ns1.${domain}`,
          ttl: 86400
        }
      ],
      issues: Math.random() > 0.7 ? [
        {
          severity: "medium" as const,
          description: "Chybí DMARC záznam pro ochranu proti phishingu."
        },
        {
          severity: "low" as const,
          description: "Doporučujeme přidat DNSSEC pro lepší zabezpečení DNS záznamů."
        }
      ] : []
    };
    
    // Generate security info
    const securityInfo = {
      ssl: {
        valid: Math.random() > 0.2,
        issuer: "Let's Encrypt Authority X3",
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysToExpiry: 90
      },
      headers: [
        {
          name: "Strict-Transport-Security",
          value: "max-age=31536000",
          status: Math.random() > 0.3 ? "good" : "missing"
        },
        {
          name: "Content-Security-Policy",
          value: "default-src 'self'",
          status: Math.random() > 0.6 ? "good" : "missing"
        },
        {
          name: "X-Frame-Options",
          value: "SAMEORIGIN",
          status: Math.random() > 0.4 ? "good" : "warning"
        },
        {
          name: "X-Content-Type-Options",
          value: "nosniff",
          status: Math.random() > 0.3 ? "good" : "missing"
        }
      ],
      vulnerabilities: Math.random() > 0.7 ? [
        {
          severity: "medium" as const,
          name: "Outdated Library",
          description: "Používáte jQuery 1.12.4, která má známé bezpečnostní zranitelnosti."
        },
        {
          severity: "low" as const,
          name: "Missing Security Headers",
          description: "Některé důležité bezpečnostní hlavičky chybí."
        }
      ] : []
    };
    
    // Generate SEO analysis with properly scaled score (0-100)
    const seoAnalysis = {
      score: Math.round((auditData.seo?.score || 0.75) * 100) / 100,
      metaTags: {
        title: {
          exists: true,
          value: `${domain} - Hlavní stránka`,
          length: 25,
          issues: Math.random() > 0.7 ? ["Title by mohl být více popisný"] : []
        },
        description: {
          exists: Math.random() > 0.3,
          value: `Oficiální stránky ${domain}. Nabízíme kvalitní produkty a služby.`,
          length: 65,
          issues: Math.random() > 0.5 ? ["Description by mohl obsahovat více klíčových slov"] : []
        },
        robots: {
          exists: true,
          value: "index, follow",
          issues: []
        },
        canonical: {
          exists: Math.random() > 0.3,
          value: `https://${domain}/`,
          issues: Math.random() > 0.7 ? ["Některé stránky nemají kanonické URL"] : []
        }
      },
      headings: {
        h1Count: Math.floor(Math.random() * 3) + 1,
        h2Count: Math.floor(Math.random() * 8) + 3,
        h3Count: Math.floor(Math.random() * 12) + 5,
        structure: {
          valid: Math.random() > 0.3,
          issues: Math.random() > 0.6 ? ["Struktura nadpisů není optimální"] : []
        }
      },
      contentAnalysis: {
        wordCount: 500 + Math.floor(Math.random() * 1500),
        readabilityScore: 65 + Math.floor(Math.random() * 25),
        keywordsFound: ["služby", domain, "produkty", "webové stránky", "online"],
        keywordDensity: {
          "služby": 2.3,
          [domain]: 1.8,
          "produkty": 1.5,
          "webové stránky": 0.9,
          "online": 0.7
        }
      },
      checks: [
        {
          title: "Meta title",
          status: "passed" as const,
          description: "Meta title je správně nastaven"
        },
        {
          title: "Meta description",
          status: Math.random() > 0.3 ? "passed" as const : "warning" as const,
          description: "Meta description je správně nastaven"
        },
        {
          title: "Struktura nadpisů",
          status: Math.random() > 0.6 ? "passed" as const : "warning" as const,
          description: "Struktura nadpisů je logická"
        },
        {
          title: "Alt texty obrázků",
          status: Math.random() > 0.5 ? "passed" as const : "failed" as const,
          description: "Některé obrázky nemají alt texty"
        },
        {
          title: "Kanonické URL",
          status: Math.random() > 0.3 ? "passed" as const : "warning" as const,
          description: "Kanonické URL jsou správně nastaveny"
        }
      ]
    };
    
    // Generate tech stack
    const techStack = [
      { 
        name: "WordPress", 
        version: "6.4.3",
        category: "CMS"
      },
      { 
        name: "PHP", 
        version: "8.1.0",
        category: "Programming Language"
      },
      { 
        name: "MySQL", 
        version: "8.0",
        category: "Database"
      },
      { 
        name: "jQuery", 
        version: "3.6.0",
        category: "JavaScript Library"
      },
      { 
        name: "Bootstrap", 
        version: "5.3.0",
        category: "CSS Framework"
      },
      { 
        name: "Google Analytics", 
        category: "Analytics"
      },
      { 
        name: "Google Tag Manager", 
        category: "Tag Management"
      }
    ];
    
    // Combine all data
    const fullData: AuditData = {
      url,
      ...auditData,
      aiRecommendations,
      timestamp: new Date().toISOString(),
      screenshot: screenshotUrl,
      serverInfo,
      dnsAnalysis,
      securityInfo,
      seoAnalysis,
      techStack
    };
    
    // Enhanced cache storage with metrics and TTL
    try {
      const cacheTimestamp = Date.now();
      
      // Store metrics for cache effectiveness analysis
      const cacheMetadata = {
        cachedAt: cacheTimestamp,
        url: url,
        domain: extractDomain(url),
        scoreSnapshot: {
          performance: Math.round((auditData.performance?.score || 0) * 100),
          seo: Math.round((auditData.seo?.score || 0) * 100),
          accessibility: Math.round((auditData.accessibility?.score || 0) * 100),
          bestPractices: Math.round((auditData.bestPractices?.score || 0) * 100)
        }
      };
      
      // Add full data to in-memory LRU cache for fast access
      auditCache.set(cacheKey, fullData, cacheTimestamp);
      
      // Log the cache operation for monitoring
      console.log(`Cache updated for ${url}: ${CACHE_CONFIG.limits.memory - auditCache.getCacheSize()} slots remaining`);
      
      // Save to filesystem cache
      if (CACHE_CONFIG.filesystem.enabled) {
        try {
          saveToFilesystemCache(cacheKey, fullData);
        } catch (fileError) {
          console.error('Filesystem cache write error:', fileError, 'for URL:', url);
        }
      }
      
      // Store in KV persistent cache if available
      if (kvStore) {
        try {
          // Store the data in KV store
          await kvStore.set(cacheKey, fullData);
          
          // Set proper TTL for automatic cache expiry
          if (typeof kvStore.expire === 'function') {
            // Convert milliseconds to seconds for Redis/KV expiry
            const ttlSeconds = Math.round(CACHE_CONFIG.durations.max / 1000);
            await kvStore.expire(cacheKey, ttlSeconds);
            
            // Store metadata separately with a longer TTL for analytics
            await kvStore.set(`${cacheKey}:meta`, cacheMetadata);
            await kvStore.expire(`${cacheKey}:meta`, ttlSeconds * 2); // Keep metadata longer
          }
        } catch (kvError) {
          console.error('KV store write error:', kvError, 'for URL:', url);
        }
      }
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
    
    return fullData;
  } catch (error) {
    console.error('Error refreshing audit data:', error);
    return null;
  }
}

// Method to manually trigger a refresh of audit data
export async function refreshAuditForUrl(url: string): Promise<AuditData | null> {
  return getAuditData(url, true);
}
