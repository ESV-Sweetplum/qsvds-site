import { Category } from '@/interfaces/category';
import Map from '@/interfaces/map';
import UserRating from '@/interfaces/userRating';
import initializeDB from '@/lib/db/initializeDB';
import GenerateHash from '@/lib/generateHash';
import { AggregateField } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const map_id = request.nextUrl.searchParams.get('id');

  if (!map_id) return Response.json({ status: 400 });

  const db = initializeDB();
  const col = db.collection('maps');
  const data = await col
    .doc(map_id).collection("ratings").get().then((col) => col.docs.map((doc) => doc.data()))

  if (!data) return Response.json({ status: 404, data: data });

  return Response.json({ status: 200, data });
}


export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.user_hash) return Response.json({ status: 401, message: "Unauthorized" })
  
    const rating: UserRating = {
        user_id: parseInt(body.user_id),
        map_id: parseInt(body.map_id),
        rating: parseInt(body.rating),
        quality: body.quality ?? "Decent"
    }
    
    const db = initializeDB();
    const col = db.collection('maps').doc(body.map_id.toString()).collection("ratings");
    
    col.doc(body.user_id.toString()).set(rating)

    const totalRatingNum: number = await col.count().get().then((col) => col.data().count)

    const ratingSum: number = await col.aggregate({sum: AggregateField.sum("rating")}).get().then((snp) => snp.data().sum)
    const newRating = ratingSum / totalRatingNum

    console.log(ratingSum)
    console.log(totalRatingNum)


    db.collection('maps').doc(body.map_id.toString()).update({rating: newRating})
  
    db.collection('users').doc(body.user_id.toString()).collection("ratings").doc(body.map_id.toString()).set(rating)

    return Response.json({ status: 200, body, newRating });
  }
