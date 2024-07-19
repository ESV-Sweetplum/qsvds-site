import GenerateHash from "@/lib/generateHash";
import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import { xpFormula } from "@/lib/xpFormula";

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (GenerateHash(body.quaver_id) !== body.hash)
        return Response.json({ status: 401, message: "Unauthorized" });

    const userScores = await prisma.score.findMany({
        where: { user: { quaver_id: parseInt(body.quaver_id) } },
        include: { map: true },
    });

    const xp = userScores.reduce(
        (total, score) =>
            total +
            xpFormula(
                score.map.totalRating,
                score.map.category,
                score.accuracy,
                score.rate
            ),
        0
    );

    await prisma.user.update({
        where: {
            quaver_id: parseInt(body.quaver_id),
        },
        data: {
            xp,
        },
    });

    return Response.json({ status: 200, xp });
}
