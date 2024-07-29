"use server";
import _ from "lodash";
import prisma from "../../../../prisma/initialize";
import "../../../styles/global.scss";
import { redirect } from "next/navigation";

export default async function RandomPage() {
    const mapCount = await prisma.map.count();
    const randomIdx = _.clamp(
        Math.floor(Math.random() * mapCount),
        0,
        mapCount - 1
    );

    const selectedMap = await prisma.map.findFirst({
        take: 1,
        skip: randomIdx,
    });

    redirect(`/map/${selectedMap?.quaver_id}`);
}
