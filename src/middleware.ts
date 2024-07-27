import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const response = NextResponse.next();

    if ((path.split("?")[0] = "/")) {
        const user_id = req.nextUrl.searchParams.get("user_id");
        const hash = req.nextUrl.searchParams.get("hash");

        if (!user_id || !hash) return;

        response.cookies.set("user_id", user_id, { httpOnly: true });
        response.cookies.set("hash", hash, { httpOnly: true });
    }
    // const url = req.nextUrl
    // const { pathname } = url
    // if (pathname.startsWith(`/api/`)) {
    //     console.log(req.headers.get("referer"))
    //     if (!req.headers.get("referer")?.includes(process.env.NEXT_PUBLIC_BASE_URL as string)) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    //     }
    //   }

    return response;
}

export const config = {
    matcher: ["/((?!_next|fonts|examples|svg|[\\w-]+\\.\\w+).*)"],
};
