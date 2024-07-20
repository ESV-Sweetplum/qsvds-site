import { NextRequest } from "next/server";
import validateAdministrator from "@/lib/validateAdministrator";

export async function GET(request: NextRequest) {
    const user_id = parseInt(
        request.nextUrl.searchParams.get("user_id") || "0"
    );
    const hash = request.nextUrl.searchParams.get("hash") || "";

    const isAdmin = await validateAdministrator(
        `Bearer ${process.env.SERVER_PW}`,
        user_id,
        hash
    );

    return Response.json({ status: 200, isAdmin });
}
