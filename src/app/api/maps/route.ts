import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const db = initializeDB();
  const col = await db.collection('maps').get();
  const docs = col.docs.map((doc) => doc.data());

  return Response.json({ status: 200, docs });
}
