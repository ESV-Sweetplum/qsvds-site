import MapDocument from '@/interfaces/mapDocument';
import initializeDB from '@/lib/db/initializeDB';
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const db = initializeDB();

    const docIDs = await db.collection("maps").get().then((col) => col.docs.map((doc) => doc.id))

    docIDs.forEach(async id => {
        const doc = db.collection("maps").doc(id)
        const mapDoc: MapDocument = await doc.get().then((doc) => doc.data()) as MapDocument
        if (!mapDoc.baseline) doc.update({baseline: false})
        if (!mapDoc.banned) doc.update({banned: false})
    })

    return Response.json({status: 200, message: "success"})
}
  