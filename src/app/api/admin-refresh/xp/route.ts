import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/initialize";
import { xpFormula } from "@/lib/xpFormula";
import getLevelData from "@/lib/getLevelData";
import validateAdministrator from "@/lib/validateAdministrator";

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

    const scores = await prisma.score.findMany({ include: { map: true } });

    const userScoreDict: Record<string, number> = {};

    new Set(scores.map(score => score.user_id)).forEach(item => {
        userScoreDict[`${item}`] = 0;
    });

    scores.forEach(score => {
        userScoreDict[`${score.user_id}`] += score.map.banned
            ? 0
            : xpFormula(
                  score.map.totalRating,
                  score.map.category,
                  score.accuracy,
                  score.rate,
                  score.verified
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
