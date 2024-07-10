import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const LIMIT = 18

  const searchTerm = request.nextUrl.searchParams.get('query')?.toLowerCase() ?? "";
  const min = request.nextUrl.searchParams.get('minRating') ?? '0';
  const max = request.nextUrl.searchParams.get('maxRating') ?? '60';
  const showBanned = request.nextUrl.searchParams.get('showBanned') ?? "false";

  const startAfter = request.nextUrl.searchParams.get('startAfter') ?? '';
  const endBefore = request.nextUrl.searchParams.get('endBefore') ?? '';

  const db = initializeDB();
  
  let colBuilder = db.collection("maps").orderBy("timeAdded", "asc")
  

  colBuilder = colBuilder.where("rating", ">=", (parseInt(min) - 0.5)).where("rating", "<=", (parseInt(max) + 0.5));

  if (!(showBanned === "true")) colBuilder = colBuilder.where("banned", "!=", true)

  if (searchTerm) colBuilder = colBuilder.where("map.titleInsensitive", ">=", searchTerm).where("map.titleInsensitive", "<", searchTerm + 'z')

  if (startAfter) colBuilder = colBuilder.startAfter(parseInt(startAfter))
  if (endBefore) colBuilder = colBuilder.endBefore(parseInt(endBefore))

  const col = await colBuilder.limit(LIMIT).get();

  const docs = col.docs.map((doc) => doc.data());

  return Response.json({ status: 200, docs });
}
