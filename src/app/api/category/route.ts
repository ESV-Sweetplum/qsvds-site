import { NextRequest } from 'next/server';
import prisma from '../../../../prisma/initialize';

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  await prisma.map.update({
    where: {
      id: parseInt(body.id)
    },
    data: {
      category: body.category
    }
  })

  return Response.json({status: 200, body})
} 
