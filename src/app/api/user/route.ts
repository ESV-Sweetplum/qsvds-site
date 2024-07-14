import User from "@/interfaces/user";
import prisma from "../../../../prisma/initialize";
import { Prisma } from "@prisma/client";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import { DefaultArgs } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const quaver_id = request.nextUrl.searchParams.get("quaver_id");
    const pw = request.nextUrl.searchParams.get("pw");
    const includeRatings = request.nextUrl.searchParams.get("includeRatings");

    if (!quaver_id && !id) return Response.json({ status: 400 });

    const queryBuilder: Prisma.UserFindUniqueArgs = {
        where: { id: parseInt(id ?? "-1e60") },
    };

    if (includeRatings === "true")
        queryBuilder.include = {
            ratings: {
                where: { map: { baseline: false } },
                include: { map: true },
            },
        };

    if (quaver_id) {
        queryBuilder.where = {
            quaver_id: parseInt(quaver_id),
        };
    }

    if (pw !== process.env.SERVER_PW) queryBuilder.omit = { hash: true };

    const user = await prisma.user.findUnique(queryBuilder);

    if (!user) return Response.json({ status: 404 });

    return Response.json({ status: 200, user });
}

export async function POST(request: NextRequest) {
    const { user, pw }: { user: any; pw: string } = await request.json();

    if (pw !== process.env.SERVER_PW)
        return Response.json({ status: 401, message: "Unauthorized" });

    const payload: any = {
        username: user.username,
        hash: user.hash,
        avatar: user.avatar,
        quaver_id: parseInt(user.quaver_id),
    };

    const newUser = await prisma.user.create({
        data: payload,
    });

    return Response.json({ status: 200, user: newUser });
}
