import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  const searchTerm = request.nextUrl.searchParams.get('query')?.toLowerCase() ?? "";
  const min = request.nextUrl.searchParams.get('minRating')?.toLowerCase() ?? '0';
  const max = request.nextUrl.searchParams.get('maxRating')?.toLowerCase() ?? '60';
  const showBanned = request.nextUrl.searchParams.get('showBanned')?.toLowerCase() ?? "false";
  let col;
  const db = initializeDB();
  if (searchTerm) {
    col = await db.collection('maps').where("map.titleInsensitive", ">=", searchTerm).where("map.titleInsensitive", "<", searchTerm + 'z').where("rating", ">=", (parseInt(min) - 0.5)).where("rating", "<=", (parseInt(max) + 0.5)).get();
  } else {
    col = await db.collection('maps').orderBy("timeAdded", "desc").where("rating", ">=", (parseInt(min) - 0.5)).where("rating", "<=", (parseInt(max) + 0.5)).get();
  }
  const docs = col.docs.map((doc) => doc.data()).filter((doc) => !doc.banned || showBanned);

  return Response.json({ status: 200, docs });
}
