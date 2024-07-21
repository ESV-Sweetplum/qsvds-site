import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/initialize";
import validateAdministrator from "@/lib/validateAdministrator";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const authorized = await validateAdministrator(
        authHeader,
        body.user_id,
        body.user_hash
    );

    if (!authorized)
        return Response.json({
            status: 401,
            message: "Unauthorized",
        });

    const ratings = await prisma.rating.findMany();

    const mapRatingDictionary: Record<string, number[]> = {};

    ratings.forEach(rating => {
        if (!mapRatingDictionary[rating.map_id].length)
            mapRatingDictionary[rating.map_id] = [];

        mapRatingDictionary[rating.map_id].push(rating.rating);
    });

    for (let i = 0; i < Object.keys(mapRatingDictionary).length; i++) {
        const map_id = Object.keys(mapRatingDictionary)[i];
        const averageRating =
            mapRatingDictionary[map_id].reduce((acc, cur) => acc + cur, 0) /
            mapRatingDictionary[map_id].length;

        await prisma.map.update({
            where: { map_id: parseInt(map_id) },
            data: { totalRating: averageRating },
        });
    }
}
