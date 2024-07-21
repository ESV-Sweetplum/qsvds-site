"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Logout() {
    cookies().delete("user_id");
    cookies().delete("hash");

    revalidatePath("/");
    redirect("/");
}
