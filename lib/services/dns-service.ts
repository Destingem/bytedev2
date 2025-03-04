import { DnsAnalysis, DnsRecord } from '@/types/audit';

export async function analyzeDns(domain: string): Promise<DnsAnalysis> {
  try {
    // In a real implementation, you would call a DNS API service
    // For example: SecurityTrails, Google Cloud DNS API, etc.
    // For now, we'll mock the response based on the domain
    
    // Mock DNS records based on domain hash
    const domainHash = simpleHash(domain);
    const mockRecords: DnsRecord[] = generateMockDnsRecords(domain, domainHash);
    
    // Generate potential issues
    const issues = analyzeDnsRecords(mockRecords, domain);
    
    return {
      records: mockRecords,
      issues
    };
  } catch (error) {
    console.error('DNS analysis error:', error);
    return {
      records: [],
      issues: [{
        severity: 'medium',
        description: 'Nepodařilo se načíst DNS záznamy. Zkontrolujte, zda je doména správně nastavena.'
      }]
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

function generateMockDnsRecords(domain: string, domainHash: number): DnsRecord[] {
  const records: DnsRecord[] = [];
  
  // A record
  records.push({
    type: 'A',
    name: domain,
    value: `104.${domainHash % 255}.${(domainHash >> 8) % 255}.${(domainHash >> 16) % 255}`,
    ttl: 3600
  });
  
  // MX records
  if (domainHash % 4 !== 0) { // 75% chance to have MX records
    records.push({
      type: 'MX',
      name: domain,
      value: '10 aspmx.l.google.com.',
      ttl: 3600
    });
    records.push({
      type: 'MX',
      name: domain,
      value: '20 alt1.aspmx.l.google.com.',
      ttl: 3600
    });
  }
  
  // TXT records for SPF
  if (domainHash % 3 !== 0) { // 66% chance to have SPF
    records.push({
      type: 'TXT',
      name: domain,
      value: 'v=spf1 include:_spf.google.com ~all',
      ttl: 3600
    });
  }
  
  // NS records
  records.push({
    type: 'NS',
    name: domain,
    value: 'ns1.digitalocean.com.',
    ttl: 172800
  });
  records.push({
    type: 'NS',
    name: domain,
    value: 'ns2.digitalocean.com.',
    ttl: 172800
  });
  
  // CNAME record
  if (domainHash % 2 === 0) { // 50% chance
    records.push({
      type: 'CNAME',
      name: `www.${domain}`,
      value: `${domain}.`,
      ttl: 3600
    });
  }
  
  return records;
}

function analyzeDnsRecords(records: DnsRecord[], domain: string): { severity: 'high' | 'medium' | 'low'; description: string; }[] {
  const issues: { severity: 'high' | 'medium' | 'low'; description: string; }[] = [];
  
  // Check for missing SPF record
  const hasSPF = records.some(r => r.type === 'TXT' && r.value.includes('v=spf1'));
  if (!hasSPF) {
    issues.push({
      severity: 'medium',
      description: 'Chybí SPF záznam. SPF pomáhá zabránit falšování e-mailů z vaší domény.'
    });
  }
  
  // Check for missing MX records
  const hasMX = records.some(r => r.type === 'MX');
  if (!hasMX) {
    issues.push({
      severity: 'medium',
      description: 'Chybí MX záznamy. E-maily z této domény nebudou fungovat.'
    });
  }
  
  // Check for missing www subdomain
  const hasWWW = records.some(r => r.name === `www.${domain}` || r.value === `www.${domain}.`);
  if (!hasWWW) {
    issues.push({
      severity: 'low',
      description: 'Chybí záznam pro www subdoménu. Uživatelé, kteří navštíví www.yourdomain.com, budou vidět chybu.'
    });
  }
  
  // Check for DMARC
  const hasDMARC = records.some(r => r.type === 'TXT' && r.name.startsWith('_dmarc.') && r.value.includes('v=DMARC1'));
  if (!hasDMARC) {
    issues.push({
      severity: 'low',
      description: 'Chybí DMARC záznam. DMARC je další vrstva ochrany proti falšování e-mailů.'
    });
  }
  
  return issues;
}
