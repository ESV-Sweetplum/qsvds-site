import User from "@/interfaces/user";
import prisma from "../../../../prisma/initialize";
import { Prisma } from "@prisma/client";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import { DefaultArgs } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const quaver_id = request.nextUrl.searchParams.get("quaver_id");
    const includeRatings = request.nextUrl.searchParams.get("includeRatings");

    if (!quaver_id && !id) return Response.json({ status: 400 });

    const queryBuilder: Prisma.UserFindUniqueArgs<DefaultArgs> = {
        where: { id: parseInt(id ?? "-1e60") },
    };

    if (includeRatings === "true")
        queryBuilder.include = { ratings: { include: { map: true } } };

    if (quaver_id) {
        queryBuilder.where = {
            quaver_id: parseInt(quaver_id),
        };
    }

    const user = await prisma.user.findUnique({
        ...queryBuilder,
        omit: { hash: true },
    });

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
