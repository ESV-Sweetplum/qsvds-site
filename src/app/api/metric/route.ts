import { NextRequest } from "next/server";
import prisma from "../../../../prisma/initialize";
import { Category, Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_AUTH}`)
        return Response.json({ status: 401, message: "Unauthorized" });

    const userCount = await prisma.user.count();
    const mapCount = await prisma.map.count();
    const ratingCount = await prisma.rating.count();

    const categories: Category[] = [
        "Reading",
        "Hybrid",
        "Memory",
        "Reverse",
        "Splitscroll",
    ];

    const categoryMapCount = [];

    for (let i = 0; i < categories.length; i++) {
        const count = await prisma.map.count({
            where: { category: categories[i] },
        });
        categoryMapCount.push(count);
    }

    await prisma.metric.create({
        data: {
            userCount,
            mapCount,
            ratingCount,
            scoreCount: 0,
            categoryMapCount,
        },
    });
}
