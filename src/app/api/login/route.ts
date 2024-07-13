import { NextRequest } from "next/server";

import axios from "axios";
import User from "@/interfaces/user";
import GenerateHash from "@/lib/generateHash";
import SearchParamBuilder from "@/lib/searchParamBuilder";

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
        .catch(e => console.log("Error 1"));

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
        .then(resp => resp)
        .catch(e => console.log("Error 2"));

    if (!resp2?.data)
        return Response.json({ status: 500, message: "Server Error" });

    const user = resp2?.data.user;

    const existingUser: any = await axios
        .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/user` +
                SearchParamBuilder({
                    quaver_id: user.id,
                    pw: process.env.SERVER_PW,
                })
        )
        .then(resp => resp.data)
        .catch(e => console.log("Error 3"));

    if (existingUser?.status === 200) {
        return Response.json({ status: 200, user: existingUser.user });
    }

    const userData: User = {
        id: -1,
        quaver_id: user.id,
        username: user.username,
        avatar: user.avatar,
        hash: GenerateHash(user.id),
    };

    let errored = false;
    let errorText = "";

    const newUser = await axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            user: userData,
            pw: process.env.SERVER_PW,
        })
        .catch(e => {
            errored = true;
            errorText = e;
        });

    if (errored) return Response.json({ status: 500, error: errorText });

    return Response.json({ status: 200, user: newUser?.data.user });
}
