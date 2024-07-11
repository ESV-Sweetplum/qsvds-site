import User from "@/interfaces/user";
import initializeDB from "@/lib/db/initializeDB";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";

// export async function GET(request: NextRequest) {
//   const id = request.nextUrl.searchParams.get("id");
//   const quaver_id = request.nextUrl.searchParams.get("quaver_id");

//   if (!quaver_id && !id) return Response.json({ status: 400 });

//   const db = initializeDB();
//   const col = db.collection("users");

//   let query;

//   if (quaver_id) {
//     query = await col.where("quaver_id", "==", parseInt(quaver_id)).get();
//   } else {
//     query = await col.where("id", "==", parseInt(id as string)).get();
//   }

//   const docs = (await col.get()).docs;
//   const highestID =
//     docs.reduce((id: number, doc) => Math.max(id, doc.data().id), 0) ?? 0;

//   if (!query.docs.length) return Response.json({ status: 404, highestID });

//   return Response.json({ status: 200, data: query.docs[0].data() });
// }

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const quaver_id = request.nextUrl.searchParams.get("quaver_id");

  if (!quaver_id && !id) return Response.json({ status: 400 });

  let user;

  if (quaver_id) {
    user = await prisma.user.findUnique({
      where: {
        quaver_id: parseInt(quaver_id),
      },
    });
  } else if (id) {
    user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  if (!user) return Response.json({ status: 404 });

  return Response.json({ status: 200, user });
}

// export async function POST(request: NextRequest) {
//   const user: User = await request.json();

//   if (user.hash !== GenerateHash(user.quaver_id)) return Response.json({ status: 401, message: "Incorrect Metadata" })

//   const db = initializeDB();
//   const col = db.collection('users');
//   const doc = col.doc(user.id.toString());
//   doc.set(user);

//   return Response.json({ status: 200 });
// }

export async function POST(request: NextRequest) {
  const { user, pw }: { user: User; pw: string } = await request.json();

  if (pw !== process.env.SERVER_PW)
    return Response.json({ status: 401, message: "Incorrect Metadata" });

  if (user.hash !== GenerateHash(user.quaver_id))
    return Response.json({ status: 401, message: "Incorrect Metadata" });

  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      hash: user.hash,
      avatar: user.avatar,
      quaver_id: user.quaver_id,
    },
  });

  //   const db = initializeDB();
  //   const col = db.collection("users");
  //   const doc = col.doc(user.id.toString());
  //   doc.set(user);

  return Response.json({ status: 200, user: newUser });
}
