import { DomainAuditClient } from '@/components/audit/DomainAuditClient'

export const dynamic = 'force-dynamic'

export default async function DomainAuditPage({
  params
}: {
  params: { domain: string }
}) {
  const resolvedParams = await params
  const domain = resolvedParams.domain
  
  // Construct the URL from the domain
  const url = `https://${domain}`
  
  return <DomainAuditClient 
    domain={domain} 
    url={url} 
  />
}
