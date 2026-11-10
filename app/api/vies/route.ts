import { NextResponse, type NextRequest } from 'next/server';
import { checkVies } from '@/lib/vies';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const vat = req.nextUrl.searchParams.get('vat') ?? '';
  if (vat.length > 20) return NextResponse.json({ status: 'invalid' });
  const limited = rateLimit(`vies:${await clientIp()}`, 60);
  if (!limited.ok) return NextResponse.json({ status: 'unavailable' }, { status: 429 });
  const result = await checkVies(vat);
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
