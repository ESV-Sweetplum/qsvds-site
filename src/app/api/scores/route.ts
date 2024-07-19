import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";

export async function GET(request: NextRequest) {
    const map_quaver_id = request.nextUrl.searchParams.get("map_quaver_id");

    if (!map_quaver_id) return Response.json({ status: 400 });

    const scores = await prisma.score.findMany({
        where: {
            map: {
                quaver_id: parseInt(map_quaver_id),
            },
        },
    });

    if (!scores.length) return Response.json({ status: 404, scores });

    return Response.json({ status: 200, scores });
}
