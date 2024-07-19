import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import axios from "axios";
import { modsToRate } from '@/lib/modsToRate';
import { xpFormula } from '../compute-xp/route';

export async function GET(request: NextRequest) {
    // const pw = request.nextUrl.searchParams.get("pw");
    // if (pw !== process.env.SERVER_PW)
        // return Response.json({ status: 401, message: "Unauthorized" });

    const rankedData = await prisma.map.findMany({
        where: {
            mapQua: {
                path: ["ranked_status"],
                equals: 2,
            },
        },
        select: {
            totalRating: true,
            category: true,
            mapQua: true,
            quaver_id: true,
            map_id: true,
        },
    });

    const rankedMD5s = rankedData.map(doc => (doc.mapQua as any).md5);
    const mapIDs = rankedData.map(doc => doc.map_id as any);

    const userData = await prisma.user.findMany({
        select: { quaver_id: true, user_id: true },
    });
    const userQuaverIDs = userData.map(obj => obj.quaver_id);
    const userIDs = userData.map(obj => obj.user_id);

    for (let i = 0; i < rankedMD5s.length; i++) {
        const scoresResp = await axios
            .get(`https://api.quavergame.com/v2/scores/${rankedMD5s[i]}/global`)
            .then(r => r.data);

        const scores = scoresResp.scores.filter((score: any) =>
            userQuaverIDs.includes(score.user.id)
        );

        const scoreDocuments = scores.map((score: any) => {
            return {
                accuracy: score.accuracy,
                pass: !score.failed,
                user_id: userIDs[userQuaverIDs.indexOf(score.user.id)],
                map_id: mapIDs[i],
                rate: modsToRate(score.modifiers)
            };
        });

        for (let j = 0; j < scoreDocuments.length; j++) {
            const scoreDoc = scoreDocuments[j]

            const whereQuery = {user_id_map_id: {user_id: scoreDoc.user_id, map_id: scoreDoc.map_id}}

            const existingScore = await prisma.score.findUnique({where: whereQuery, include: {map:true}})

            if (existingScore) {
                const oldXP = xpFormula(existingScore.map.totalRating, existingScore.map.category, existingScore.accuracy, existingScore.rate)
                const newXP = xpFormula(existingScore.map.totalRating, existingScore.map.category, scoreDoc.accuracy, scoreDoc.rate)

                if (oldXP > newXP) continue; 

               const updateResp =  await prisma.score.update({
                    where: whereQuery,
                    data: {
                        accuracy: scoreDoc.accuracy,
                        pass: scoreDoc.pass,
                        rate: scoreDoc.rate
                    }
                })
                console.log(updateResp)

            } else {
                const createResp = await prisma.score.create({
                    data: scoreDoc
                })

                console.log(createResp)
            }
        }
    }

    return Response.json({ status: 200 });
}
