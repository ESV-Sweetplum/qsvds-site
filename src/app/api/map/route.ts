import { Category } from '@/interfaces/category';
import Map from '@/interfaces/map';
import UserRating from '@/interfaces/userRating';
import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const map_id = request.nextUrl.searchParams.get('id');

  if (!map_id) return Response.json({ status: 400 });

  const db = initializeDB();
  const col = db.collection('maps');
  const data = await col
    .doc(map_id)
    .get()
    .then((doc) => doc.data())
    .catch((e) => e);

  if (!data) return Response.json({ status: 404, data: data });

  return Response.json({ status: 200, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const map: Map = body.map;
  map.titleInsensitive = map.title.toLowerCase()

  const userRating: UserRating = {
    map_id: map.id,
    user_id: parseInt(body.user_id),
    rating: parseInt(body.rating),
    quality: body.quality ?? "Decent"
  };
  const category: Category = body.category.toLowerCase();

  const db = initializeDB();
  const col = db.collection('maps');
  const doc = col.doc(map.id.toString());
  doc.set({ map, rating: parseInt(body.rating), category, timeAdded: Date.now() });
  doc.collection('ratings').doc(body.user_id.toString()).set(userRating);

  db.collection('users').doc(body.user_id.toString()).collection("ratings").doc(map.id.toString()).set(userRating)

  return Response.json({ status: 200, body });
}
