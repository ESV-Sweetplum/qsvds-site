import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/initialize";
import { xpFormula } from "@/lib/xpFormula";
import getLevelData from "@/lib/getLevelData";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.SERVER_PW}`)
        return Response.json({
            status: 401,
            message: "Unauthorized",
        });

    const scores = await prisma.score.findMany({ include: { map: true } });

    const userScoreDict: Record<string, number> = {};

    new Set(scores.map(score => score.user_id)).forEach(item => {
        userScoreDict[`${item}`] = 0;
    });

    scores.forEach(score => {
        userScoreDict[`${score.user_id}`] += xpFormula(
            score.map.totalRating,
            score.map.category,
            score.accuracy,
            score.rate
        );
    });

    for (let i = 0; i < Object.keys(userScoreDict).length; i++) {
        const levelData = getLevelData(
            userScoreDict[Object.keys(userScoreDict)[i]]
        );

        await prisma.user.update({
            where: {
                user_id: parseInt(Object.keys(userScoreDict)[i]),
            },
            data: {
                level: levelData.level,
                xp: levelData.remainingXP,
            },
        });
    }

    return Response.json({ status: 200 });
}
