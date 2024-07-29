import prisma from "../../prisma/initialize";
import GenerateHash from "./generateHash";

export default async function validateAdministrator(
    authHeader: string | null,
    user_id: number = 0,
    hash: string = ""
) {
    if ((authHeader ?? "") !== `Bearer ${process.env.SERVER_PW}`) return false;

    const user = await prisma.user.findUnique({ where: { user_id } });

    if (!user) return false;
    if (user.role !== "Administrator") return false;

    if (GenerateHash(user.quaver_id) !== hash) return false;

    return true;
}
