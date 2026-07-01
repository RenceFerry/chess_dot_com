import { NextResponse } from 'next/server';
import { getUserDet } from '@/_utils/serverActions/fetchActions';

export async function GET() {
  try {
    console.log('[API /user] GET request received');
    const { data, error } = await getUserDet();
    if (error) throw new Error(error);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API /user] Error:', message);
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
