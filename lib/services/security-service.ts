import { SecurityInfo, DomainReputation } from '@/types/audit';

export async function analyzeSecurityInfo(url: string): Promise<SecurityInfo> {
  try {
    const domainHash = simpleHash(url);
    
    // Mock SSL info
    const sslValid = domainHash % 10 !== 0; // 90% chance to be valid
    const daysToExpiry = 30 + (domainHash % 330); // Between 30 and 360 days
    
    // Mock security headers
    const headers = generateSecurityHeaders(domainHash);
    
    // Mock vulnerabilities
    const vulnerabilities = [];
    
    // Add a few random vulnerabilities based on domain hash
    if (domainHash % 5 === 0) {
      vulnerabilities.push({
        severity: 'medium',
        name: 'jQuery Outdated',
        description: 'Zjištěna zastaralá verze jQuery, která může obsahovat bezpečnostní chyby.'
      });
    }
    
    if (domainHash % 7 === 0) {
      vulnerabilities.push({
        severity: 'high',
        name: 'Cross-Site Scripting (XSS) Vulnerability',
        description: 'Detekována potenciální XSS zranitelnost ve formulářích.'
      });
    }
    
    if (domainHash % 11 === 0) {
      vulnerabilities.push({
        severity: 'low',
        name: 'Cookies bez Secure Flag',
        description: 'Některé cookies nemají nastaven Secure flag, což by mohlo vést k jejich přenosu přes nezabezpečené připojení.'
      });
    }
    
    return {
      ssl: {
        valid: sslValid,
        issuer: sslValid ? 'Let\'s Encrypt Authority X3' : undefined,
        expiryDate: sslValid ? getExpiryDate(daysToExpiry) : undefined,
        daysToExpiry: sslValid ? daysToExpiry : undefined
      },
      headers,
      vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : undefined
    };
  } catch (error) {
    console.error('Security analysis error:', error);
    return {
      ssl: { valid: false },
      headers: []
    };
  }
}

export async function getDomainReputation(domain: string): Promise<DomainReputation> {
  try {
    const domainHash = simpleHash(domain);
    
    // Generate a reputation score between 0 and 100
    const score = Math.min(100, Math.max(0, 70 + (domainHash % 30)));
    
    // Determine if blacklisted (low probability)
    const blacklisted = domainHash % 20 === 0;
    
    // List of blacklist providers
    const blacklistedOn = blacklisted ? ['SpamHaus'] : undefined;
    
    // Spam score (0-10)
    const spamScore = blacklisted ? 7 + (domainHash % 3) : 0 + (domainHash % 2);
    
    // Malware detected (very low probability)
    const malwareDetected = domainHash % 50 === 0;
    
    return {
      score,
      blacklisted,
      blacklistedOn,
      spamScore,
      malwareDetected
    };
  } catch (error) {
    console.error('Domain reputation analysis error:', error);
    return {
      score: 0,
      blacklisted: false,
      malwareDetected: false
    };
  }
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function generateSecurityHeaders(domainHash: number): { name: string; value: string; status: 'good' | 'warning' | 'missing'; }[] {
  const headers = [];
  
  // Randomly decide which headers are present based on domain hash
  
  // X-Content-Type-Options
  if (domainHash % 3 !== 0) {
    headers.push({
      name: 'X-Content-Type-Options',
      value: 'nosniff',
      status: 'good'
    });
  } else {
    headers.push({
      name: 'X-Content-Type-Options',
      value: '',
      status: 'missing'
    });
  }
  
  // X-Frame-Options
  if (domainHash % 4 !== 0) {
    headers.push({
      name: 'X-Frame-Options',
      value: 'SAMEORIGIN',
      status: 'good'
    });
  } else {
    headers.push({
      name: 'X-Frame-Options',
      value: '',
      status: 'missing'
    });
  }
  
  // Content-Security-Policy
  if (domainHash % 2 === 0) {
    headers.push({
      name: 'Content-Security-Policy',
      value: "default-src 'self'",
      status: 'good'
    });
  } else {
    headers.push({
      name: 'Content-Security-Policy',
      value: '',
      status: 'missing'
    });
  }
  
  // Strict-Transport-Security
  if (domainHash % 5 !== 0) {
    headers.push({
      name: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains',
      status: 'good'
    });
  } else {
    headers.push({
      name: 'Strict-Transport-Security',
      value: '',
      status: 'missing'
    });
  }
  
  return headers;
}

function getExpiryDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}
