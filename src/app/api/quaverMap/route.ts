import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const map_quaver_id = request.nextUrl.searchParams.get("quaver_id");

    console.log(map_quaver_id);

    const resp = await axios
        .get(`https://api.quavergame.com/v2/map/${map_quaver_id}`)
        .then(r => r.data);

    return Response.json({ status: 200, resp });
}
