import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/initialize";
import validateAdministrator from "@/lib/validateAdministrator";
import GenerateHash from "@/lib/generateHash";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const authorized = await validateAdministrator(
        authHeader,
        body.user_id,
        body.hash
    );

    if (!authorized)
        return Response.json({
            status: 401,
            message: "Unauthorized",
        });

    const users = await prisma.user.findMany();

    const newUserHashes = users.map(user => GenerateHash(user.quaver_id));

    for (let i = 0; i < newUserHashes.length; i++) {
        await prisma.user.update({
            where: {
                user_id: users[i].user_id,
            },
            data: {
                hash: newUserHashes[i],
            },
        });
    }
}
