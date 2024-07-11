import UserRating from "@/interfaces/userRating";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import _ from "lodash";

import axios from "axios";
import prisma from "../../../../prisma/initialize";

export async function GET(request: NextRequest) {
    const map_id = request.nextUrl.searchParams.get("id");

    if (!map_id) return Response.json({ status: 400 });

    const map = await prisma.map.findUnique({
        where: {
            quaver_id: parseInt(map_id),
        },
    });

    if (!map) return Response.json({ status: 404, map });

    return Response.json({ status: 200, map });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.user_hash)
        return Response.json({ status: 401, message: "Unauthorized" });

    const map = body.map;

    const quaverResp = await axios
        .get(`https://api.quavergame.com/v1/maps/${map.id}`)
        .catch((e) => console.log("Error 1"));

    if (quaverResp?.data?.status !== 200)
        return Response.json({ status: 404, message: "Map wasn't found." });

    if (!_.isEqual(quaverResp.data.map, map))
        return Response.json({ status: 404, message: "Map was invalid." });

    map.titleInsensitive = map.title.toLowerCase();

    const userRating: UserRating = {
        map_id: map.id,
        user_id: parseInt(body.user_id),
        rating: parseInt(body.rating),
        quality: body.quality ?? "Decent",
    };

    const category = body.category;

    const mapDoc = await prisma.map.create({
        data: {
            map,
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
            map_id: mapDoc.id,
            quality: userRating.quality,
            rating: userRating.rating,
        },
    });

    return Response.json({ status: 200, mapDoc, ratingDoc });
}
