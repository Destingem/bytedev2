export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: "good" | "needs-improvement" | "poor" | null;
}

export interface SeoCheck {
  title: string;
  status: "passed" | "failed" | "warning";
  description: string;
}

export interface Technology {
  name: string;
  version?: string;
  category?: string;
}

export interface ServerInfo {
  ip: string;
  server: string;
  location: string;
  dns: string;
}

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
}

export interface DnsAnalysis {
  records: DnsRecord[];
  issues?: {
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface SecurityInfo {
  ssl: {
    valid: boolean;
    issuer?: string;
    expiryDate?: string;
    daysToExpiry?: number;
  };
  headers: {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'missing';
  }[];
  vulnerabilities?: {
    severity: 'high' | 'medium' | 'low';
    name: string;
    description: string;
  }[];
}

export interface DomainReputation {
  score: number;
  blacklisted: boolean;
  blacklistedOn?: string[];
  spamScore?: number;
  malwareDetected: boolean;
}

export interface SeoAnalysis {
  score: number;
  metaTags: {
    title?: {
      exists: boolean;
      value?: string;
      length?: number;
      issues?: string[];
    };
    description?: {
      exists: boolean;
      value?: string;
      length?: number;
      issues?: string[];
    };
    robots?: {
      exists: boolean;
      value?: string;
      issues?: string[];
    };
    canonical?: {
      exists: boolean;
      value?: string;
      issues?: string[];
    };
  };
  headings: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    structure: {
      valid: boolean;
      issues?: string[];
    };
  };
  contentAnalysis: {
    wordCount: number;
    readabilityScore?: number;
    keywordsFound?: string[];
    keywordDensity?: {
      [keyword: string]: number;
    };
  };
  checks: SeoCheck[];
}

export interface AuditItem {
  title: string;
  description: string;
  score: number;
}

export interface AuditCategory {
  score: number;
  audits?: AuditItem[];
}

export interface AiRecommendation {
  summary: string;
  priorities: {
    title: string;
    description: string;
  }[];
}

export interface KeyIssue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AuditData {
  url: string;
  timestamp: string;
  performance: AuditCategory;
  seo: AuditCategory;
  accessibility: AuditCategory;
  bestPractices: AuditCategory;
  aiRecommendations?: AiRecommendation;
  keyIssues?: KeyIssue[];
  screenshot?: string;
  
  // New fields
  serverInfo?: ServerInfo;
  dnsAnalysis?: DnsAnalysis;
  securityInfo?: SecurityInfo;
  domainReputation?: DomainReputation;
  seoAnalysis?: SeoAnalysis;
  techStack?: Technology[];
}
