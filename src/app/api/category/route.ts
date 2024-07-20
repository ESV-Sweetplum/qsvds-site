import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import validateAdministrator from "@/lib/validateAdministrator";

export async function PATCH(request: NextRequest) {
    const body = await request.json();

    const isAdmin = await validateAdministrator(
        `Bearer ${process.env.SERVER_PW}`,
        body.user_id,
        body.hash
    );

    if (!isAdmin)
        return Response.json({
            status: 401,
            message: "You do not have permission to execute this action.",
        });

    await prisma.map.update({
        where: {
            map_id: parseInt(body.id),
        },
        data: {
            category: body.category,
        },
    });

    return Response.json({ status: 200, body });
}
