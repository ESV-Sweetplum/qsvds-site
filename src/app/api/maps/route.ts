import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";

export async function GET(request: NextRequest) {
    const LIMIT = 18;

    const searchTerm =
        request.nextUrl.searchParams.get("query")?.toLowerCase() ?? "";
    const min = request.nextUrl.searchParams.get("minRating") ?? "0";
    const max = request.nextUrl.searchParams.get("maxRating") ?? "60";
    const showBanned =
        request.nextUrl.searchParams.get("showBanned") ?? "false";

    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");

    const builder: Record<string, any> = {
        totalRating: {
            gte: parseInt(min) - 0.5,
            lte: parseInt(max) + 0.5,
        },
    };

    if (!(showBanned === "true")) builder.banned = false;

    if (searchTerm)
        builder.map = {
            path: ["title"],
            string_contains: searchTerm,
        };

    const maps = await prisma.map.findMany({
        skip: LIMIT * (page - 1),
        take: LIMIT,
        where: builder,
        orderBy: {
            createdAt: "desc",
        },
    });

    return Response.json({ status: 200, maps });
}
