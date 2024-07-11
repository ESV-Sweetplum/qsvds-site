import UserRating from "@/interfaces/userRating";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import _ from "lodash";

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.user_hash)
        return Response.json({ status: 401, message: "Unauthorized" });

    const rating: UserRating = {
        user_id: parseInt(body.user_id),
        map_id: parseInt(body.map_id),
        rating: _.clamp(parseInt(body.rating), 0, 60),
        quality: body.quality ?? "Decent",
    };

    const userExists = !!prisma.user.findFirst({
        where: { id: parseInt(body.user_id) },
    });

    const mapExists = !!prisma.map.findFirst({
        where: { id: parseInt(body.map_id) },
    });

    if (!userExists)
        return Response.json({ status: 404, message: "User does not exist" });

    if (!mapExists)
        return Response.json({ status: 404, message: "Map does not exist" });

    const newRating = await prisma.rating.create({
        data: {
            user_id: rating.user_id,
            map_id: rating.map_id,
            quality: rating.quality,
            rating: rating.rating,
        },
    });

    const aggregateRating = await prisma.rating
        .aggregate({
            _avg: {
                rating: true,
            },
            where: {
                map_id: rating.map_id,
            },
        })
        .then((d) => d._avg.rating);

    const updateMap = await prisma.map.update({
        where: {
            id: rating.map_id,
        },
        data: {
            totalRating: aggregateRating ?? 0,
        },
    });

    return Response.json({ status: 200, body, newMap: updateMap, newRating });
}
