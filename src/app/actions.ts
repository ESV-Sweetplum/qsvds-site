"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "../../prisma/initialize";
import GenerateHash from "@/lib/generateHash";
import { User } from "@prisma/client";

export async function Logout() {
    cookies().delete("user_id");
    cookies().delete("hash");

    revalidatePath("/");
    redirect("/");
}

export async function GetUser(): Promise<User | undefined> {
    const user_id = cookies().get("user_id")?.value;
    const hash = cookies().get("hash")?.value;

    if (!user_id) return undefined;

    const user = await prisma.user.findUnique({
        where: { user_id: parseInt(user_id as string) },
    });

    if (GenerateHash(user?.quaver_id ?? 0) !== (hash as string) || !user) {
        Logout();
        return undefined;
    }

    return user;
}
