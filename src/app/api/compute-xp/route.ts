import GenerateHash from '@/lib/generateHash';
import { NextRequest } from 'next/server';
import prisma from '../../../../prisma/initialize';
import MapDocument from '@/interfaces/mapDocument';
import { Category } from '@prisma/client';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (GenerateHash(body.quaver_id) !== body.hash)
      return Response.json({ status: 401, message: "Unauthorized" });

  const userScores = await prisma.score.findMany({where: {user: {quaver_id: parseInt(body.quaver_id)}}, include: {map: true}})

  const xp = userScores.reduce((total, score) => total + xpFormula(score.map.totalRating, score.map.category, score.accuracy, score.rate), 0)

  await prisma.user.update({
    where: {
      quaver_id: parseInt(body.quaver_id)
    },
    data: {
      xp
    }
  })

  return Response.json({status: 200, xp})
}

function xpFormula(mapRating: number, category: Category, accuracy: number, rate: number) {
  const thresholds = [0, 70, 80,  85,  90,  93,   95,   97,  98,   99, 100]
  const bias =       [0, 0.1, 0.5, 0.6, 0.7, 0.77, 0.82, 0.9, 0.95, 1, 1]
  
  let bottom = 0
  
  thresholds.forEach((t) => {
      if (t < accuracy) bottom = t
  })
  
  const tRange = [bottom, thresholds[thresholds.indexOf(bottom) + 1]]
  const bRange = tRange.map((t) => bias[thresholds.indexOf(t)])

  const ratingCoefficient = lerp(accuracy, tRange[0], tRange[1], bRange[0], bRange[1])
  return ratingCoefficient * mapRating
}

function lerp(v: number, s1: number, e1: number, s2: number, e2: number) {
  const p = (v - s1) / (e1 - s1)
  return (e2 - s2) * p + s2
}
