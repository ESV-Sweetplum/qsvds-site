import { NextRequest } from "next/server";

import axios from "axios";

export async function POST(request: NextRequest, response: Response) {
  const body = await request.json();

  const code = body.code as string;

  const resp = await axios
    .post(`https://quavergame.com/oauth2/token`, {
      client_id: process.env.NEXT_PUBLIC_QUAVER_CLIENT_ID,
      client_secret: process.env.QUAVER_CLIENT_SECRET,
      grant_type: "client_credentials",
      code,
    })
    .catch((e) => console.log("Error 1"));

  const access_token = resp?.data.access_token;

  if (!access_token) {
    return Response.json({ status: 400, msg: "Access code not found." });
  }
  const resp2 = await axios
    .post(
      "https://quavergame.com/oauth2/me",
      { code: access_token },
      {
        headers: {
          Authorization: `Bearer ${process.env.QUAVER_CLIENT_SECRET}`,
        },
      }
    )
    .then((resp) => resp)
    .catch((e) => console.log("Error 2"));

  return Response.json({ status: 200, data: resp2?.data });
}
