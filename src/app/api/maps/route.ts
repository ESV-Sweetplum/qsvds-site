import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  const searchTerm = request.nextUrl.searchParams.get('query')?.toLowerCase() ?? "";
  let col;
  const db = initializeDB();
  if (searchTerm) {
    col = await db.collection('maps').where("map.titleInsensitive", ">=", searchTerm).where("map.titleInsensitive", "<", searchTerm + 'z').get();
  } else {
    col = await db.collection('maps').orderBy("timeAdded", "desc").get();
  }
  const docs = col.docs.map((doc) => doc.data());
  return Response.json({ status: 200, docs });
}
