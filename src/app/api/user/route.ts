import User from '@/interfaces/user';
import initializeDB from '@/lib/db/initializeDB';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get('id');

  if (!user_id) return null;

  const db = initializeDB();
  const col = db.collection('users');

  const query = await col.where('quaver_id', '==', parseInt(user_id)).get();

  const docs = (await col.get()).docs;
  const highestID =
    docs.reduce((id: number, doc) => Math.max(id, doc.data().id), 0) ?? 0;

  if (!query.docs.length) return NextResponse.json({ status: 404, highestID });

  return NextResponse.json({ status: 200, data: query.docs[0].data() });
}

export async function POST(request: NextRequest) {
  const user: User = await request.json();

  const db = initializeDB();
  const col = db.collection('users');
  const doc = col.doc(user.id.toString());
  doc.set(user);

  return NextResponse.json({ status: 200 });
}
