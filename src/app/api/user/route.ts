import User from "@/interfaces/user";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const quaver_id = request.nextUrl.searchParams.get("quaver_id");

    if (!quaver_id && !id) return Response.json({ status: 400 });

    let user;

    if (quaver_id) {
        user = await prisma.user.findUnique({
            where: {
                quaver_id: parseInt(quaver_id),
            },
        });
    } else if (id) {
        user = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
        });
    }

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
