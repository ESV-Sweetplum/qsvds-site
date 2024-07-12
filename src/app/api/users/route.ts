import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";

export async function GET(request: NextRequest) {
    let LIMIT = 10;

    const searchTerm =
        request.nextUrl.searchParams.get("query")?.toLowerCase() ?? "";

    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");

    const limited = request.nextUrl.searchParams.get("limited") ?? "true";

    const quaver_id = request.nextUrl.searchParams.get("quaver_id") ?? "0";

    const hash = request.nextUrl.searchParams.get("hash") ?? "0";

    if (limited === "false") {
        if (GenerateHash(parseInt(quaver_id)) === hash) {
            LIMIT = 1000;
        }
    }

    const users = await prisma.user.findMany({
        skip: LIMIT * (page - 1),
        take: LIMIT,
        where: {
            username: {
                contains: searchTerm || "",
                mode: "insensitive",
            },
        },
        orderBy: {
            ratings: {
                _count: "desc",
            },
        },
        include: {
            ratings:
                request.nextUrl.searchParams
                    .get("includeRatings")
                    ?.toLowerCase() === "true",
        },
        omit: { hash: true },
    });

    const pageCount = Math.ceil((await prisma.user.count()) / LIMIT);

    return Response.json({ status: 200, users, pageCount });
}
