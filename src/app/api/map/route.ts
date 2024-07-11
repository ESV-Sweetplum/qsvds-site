import { Category } from '@/interfaces/category';
import Map from '@/interfaces/map';
import UserRating from '@/interfaces/userRating';
import initializeDB from '@/lib/db/initializeDB';
import GenerateHash from '@/lib/generateHash';
import { NextRequest } from 'next/server';
import _ from 'lodash';

import axios from 'axios';

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

  if (GenerateHash(body.quaver_id) !== body.user_hash)
    return Response.json({ status: 401, message: 'Unauthorized' });

  const map: Map = body.map;
  map.titleInsensitive = map.title.toLowerCase();

  const quaverResp = await axios
    .get(`https://api.quavergame.com/v1/maps/${map.id}`)
    .catch((e) => console.log('Error 1'));

  if (quaverResp?.data?.status !== 200)
    return Response.json({ status: 404, message: "Map wasn't found" });

  if (!_.isEqual(quaverResp.data.map, map))
    return Response.json({ status: 404, message: 'Map was invalid.' });

  const userRating: UserRating = {
    map_id: map.id,
    user_id: parseInt(body.user_id),
    rating: parseInt(body.rating),
    quality: body.quality ?? 'Decent',
  };
  const category: Category = body.category.toLowerCase();

  const db = initializeDB();
  const col = db.collection('maps');
  const doc = col.doc(map.id.toString());
  doc.set({
    map,
    rating: _.clamp(parseInt(body.rating), 0,60),
    category,
    timeAdded: Date.now(),
    baseline: false,
    banned: false,
  });
  doc.collection('ratings').doc(body.user_id.toString()).set(userRating);

  db.collection('users')
    .doc(body.user_id.toString())
    .collection('ratings')
    .doc(map.id.toString())
    .set(userRating);

  return Response.json({ status: 200, body });
}
