"use server";

import { Container } from "@radix-ui/themes";
import "../../styles/global.scss";
import { getUser, userIsAdmin } from "../actions";
import { redirect } from "next/navigation";
import prisma from "../../../prisma/initialize";

export default async function AdminPage() {
    const isAdmin = await userIsAdmin();
    if (!isAdmin) redirect("/");

    const maps = await prisma.map.findMany();

    return <Container></Container>;
}
