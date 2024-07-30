import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { Category, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    let LIMIT = 18;

    const searchTerm =
        request.nextUrl.searchParams.get("query")?.toLowerCase() ?? "";
    const min = request.nextUrl.searchParams.get("minRating") ?? "0";
    const max = request.nextUrl.searchParams.get("maxRating") ?? "60";
    const showBanned =
        request.nextUrl.searchParams.get("showBanned") ?? "false";

    const categories = (
        request.nextUrl.searchParams.get("categories") ?? "rd,hb,mm,rv,ss"
    ).split(",");

    const forceRanked =
        request.nextUrl.searchParams.get("forceRanked") ?? "false";

    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");

    const limited = request.nextUrl.searchParams.get("limited") ?? "true";

    const quaver_id = request.nextUrl.searchParams.get("quaver_id") ?? "0";

    const hash = request.nextUrl.searchParams.get("hash") ?? "0";

    if (limited === "false") {
        if (GenerateHash(parseInt(quaver_id)) === hash) {
            LIMIT = 1000;
        }
    }

    const queryBuilder: Prisma.MapWhereInput = {
        totalRating: {
            gte: parseInt(min) - 0.5,
            lte: parseInt(max) + 0.5,
        },
    };

    if (!(showBanned === "true")) queryBuilder.banned = false;

    if (searchTerm)
        queryBuilder.mapQua = {
            path: ["titleInsensitive"],
            string_contains: searchTerm,
        };

    if (forceRanked === "true") queryBuilder.ranked = true;

    const categoryObj: Record<string, Category> = {
        rd: "Reading",
        hb: "Hybrid",
        mm: "Memory",
        rv: "Reverse",
        ss: "Splitscroll",
    };

    const totalQuery = {
        OR: categories.map(category => {
            return { ...queryBuilder, category: categoryObj[category] };
        }),
    };

    const maps = await prisma.map.findMany({
        skip: LIMIT * (page - 1),
        take: LIMIT,
        where: totalQuery,
        orderBy: {
            createdAt: "desc",
        },
    });

    const pageCount = Math.ceil(
        (await prisma.map.count({ where: totalQuery })) / LIMIT
    );

    return Response.json({ status: 200, maps, pageCount });
}
