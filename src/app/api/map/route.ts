import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import _ from "lodash";

import axios from "axios";
import prisma from "../../../../prisma/initialize";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    const map_id = request.nextUrl.searchParams.get("id");
    const map_quaver_id = request.nextUrl.searchParams.get("quaver_id");

    if (!map_quaver_id && !map_id) return Response.json({ status: 400 });

    const queryBuilder: Prisma.MapFindUniqueArgs = {
        where: { quaver_id: parseInt(map_quaver_id ?? "0") },
    };

    if (map_id) {
        delete queryBuilder.where.quaver_id;
        queryBuilder.where = { map_id: parseInt(map_id) };
    }

    const map = await prisma.map.findUnique(queryBuilder);

    if (!map) return Response.json({ status: 404, map });

    return Response.json({ status: 200, map });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.hash)
        return Response.json({ status: 401, message: "Unauthorized" });

    const map = body.map;

    const quaverResp = await axios
        .get(`https://api.quavergame.com/v1/maps/${map.id}`)
        .catch(e => console.log("Error 1"));

    if (quaverResp?.data.status !== 200)
        return Response.json({ status: 404, message: "Map wasn't found." });

    if (!_.isEqual(quaverResp?.data.map, map))
        return Response.json({ status: 404, message: "Map was invalid." });

    map.titleInsensitive = map.title.toLowerCase();

    const category = body.category;

    const mapDoc = await prisma.map.create({
        data: {
            mapQua: map,
            quaver_id: map.id,
            submittedBy_id: parseInt(body.user_id),
            totalRating: _.clamp(parseInt(body.rating), 0, 60),
            category,
            baseline: false,
            banned: false,
        },
    });

    const ratingDoc = await prisma.rating.create({
        data: {
            user_id: parseInt(body.user_id),
            map_quaver_id: map.id,
            map_id: mapDoc.map_id,
            quality: body.quality ?? "Decent",
            rating: parseInt(body.rating),
        },
    });

    return Response.json({ status: 200, mapDoc, ratingDoc });
}
