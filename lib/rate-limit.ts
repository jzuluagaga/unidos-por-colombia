import 'server-only'
import { sql } from './db'

const WINDOW_MINUTES = 10
const MAX_SUBMISSIONS_PER_WINDOW = 3

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const rows = (await sql`
    select count(*)::int as count
    from report_submissions
    where ip = ${ip}
      and created_at > now() - (${WINDOW_MINUTES} * interval '1 minute')
  `) as { count: number }[]
  return (rows[0]?.count ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW
}

export async function recordSubmission(ip: string): Promise<void> {
  await sql`insert into report_submissions (ip) values (${ip})`
}
