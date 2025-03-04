import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    // Add protocol if missing to make URL constructor work
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    const hostname = new URL(url).hostname
    // Remove www. if present
    return hostname.replace(/^www\./, '')
  } catch (e) {
    // Return original input if parsing fails
    return url.replace(/^https?:\/\/(www\.)?/, '')
  }
}

export function parseURL(url: string): URL {
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  try {
    return new URL(url);
  } catch (error) {
    throw new Error("Invalid URL format");
  }
}

// Generate a report ID for client-side use
export function generateReportId(url: string): string {
  // Simple hash function for client-side
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to a hex string and take first 8 chars
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
  
  // Encode the URL
  const encodedUrl = encodeURIComponent(url);
  
  return `${hexHash}-${encodedUrl}`;
}

// Generate a share URL for audit
export function generateShareUrl(url: string): string {
  const domain = extractDomain(url);
  return `/audit/${domain}`;
}

// Format a date as a distance from now (e.g., "2 hours ago")
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds, minutes, hours, days
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} ${diffSec === 1 ? 'sekundu' : diffSec < 5 ? 'sekundy' : 'sekund'} zpět`;
  }
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minutu' : diffMin < 5 ? 'minuty' : 'minut'} zpět`;
  }
  
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hodinu' : diffHours < 5 ? 'hodiny' : 'hodin'} zpět`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'den' : diffDays < 5 ? 'dny' : 'dní'} zpět`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} ${diffMonths === 1 ? 'měsíc' : diffMonths < 5 ? 'měsíce' : 'měsíců'} zpět`;
}
