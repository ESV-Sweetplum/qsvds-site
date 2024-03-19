import { Category } from '@/interfaces/category';
import Map from '@/interfaces/map';
import UserRating from '@/interfaces/userRating';
import Rating from '@/interfaces/userRating';
import initializeDB from '@/lib/db/initializeDB';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const map_id = request.nextUrl.searchParams.get('id');

  if (!map_id) return null;

  const db = initializeDB();
  const col = db.collection('maps');
  const data = await col
    .doc(map_id)
    .get()
    .then((doc) => doc.data());

  if (!data) return NextResponse.json({ status: 404 });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const map: Map = body.map;
  const userRating: UserRating = {
    map_id: map.id,
    user_id: body.user_id,
    rating: body.rating,
  };
  const category: Category = body.category.toLowerCase();

  const db = initializeDB();
  const col = db.collection('maps');
  const doc = col.doc(map.id.toString());
  doc.set({ map, rating: body.rating, category });
  doc.collection('ratings').doc(body.user_id.toString()).set(userRating);

  return NextResponse.json(body);
}
