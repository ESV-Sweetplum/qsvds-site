import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";

export async function PATCH(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.user_quaver_id) !== body.hash)
        return Response.json({
            status: 401,
            message: "Hash and ID do not match.",
        });

    const user = await prisma.user.findUnique({
        where: { quaver_id: parseInt(body.user_quaver_id) },
    });

    if (user?.role !== "Administrator")
        return Response.json({
            status: 401,
            message: "You do not have permission to execute this action.",
        });

    await prisma.map.update({
        where: {
            id: parseInt(body.id),
        },
        data: {
            category: body.category,
        },
    });

    return Response.json({ status: 200, body });
}
