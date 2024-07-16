import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import _ from "lodash";

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.hash)
        return Response.json({ status: 401, message: "Unauthorized" });

    const rating = _.clamp(parseInt(body.rating), 0, 60);

    const userExists = !!prisma.user.findFirst({
        where: { user_id: parseInt(body.user_id) },
    });

    const mapExists = await prisma.map.findFirst({
        where: { quaver_id: parseInt(body.map_id) },
    });

    if (!userExists)
        return Response.json({ status: 404, message: "User does not exist" });

    if (!mapExists)
        return Response.json({ status: 404, message: "Map does not exist" });

    if (mapExists.baseline)
        return Response.json({
            status: 401,
            message: "You cannot edit a baseline map.",
        });

    const existingRating = await prisma.rating.findFirst({
        where: {
            user_id: parseInt(body.user_id),
            map_id: mapExists.map_id,
        },
    });

    if (existingRating) {
        await prisma.rating.update({
            where: {
                rating_id: existingRating.rating_id,
            },
            data: {
                rating: rating,
            },
        });
    } else {
        await prisma.rating.create({
            data: {
                user_id: parseInt(body.user_id),
                map_id: mapExists.map_id,
                quality: body.quality ?? "Decent",
                rating: rating,
            },
        });
    }

    const aggregateRating = await prisma.rating
        .aggregate({
            _avg: {
                rating: true,
            },
            where: {
                map_id: mapExists.map_id,
            },
        })
        .then(d => d._avg.rating);

    const updateMap = await prisma.map.update({
        where: {
            map_id: mapExists.map_id,
        },
        data: {
            totalRating: aggregateRating ?? 0,
        },
    });

    const newRatings = await prisma.rating.findMany({
        where: {
            map_id: mapExists.map_id,
        },
    });

    return Response.json({
        status: 200,
        body,
        newMap: updateMap,
        newRatings,
        newTotalRating: aggregateRating,
    });
}
