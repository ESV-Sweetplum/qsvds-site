import _ from "lodash";
import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";

export async function GET(request: NextRequest) {
    const map_id = request.nextUrl.searchParams.get("id");

    if (!map_id) return Response.json({ status: 400 });

    const ratings = await prisma.rating.findMany({
        where: {
            map_quaver_id: parseInt(map_id),
        },
    });

    if (!ratings.length) return Response.json({ status: 404, ratings });

    return Response.json({ status: 200, ratings });
}
