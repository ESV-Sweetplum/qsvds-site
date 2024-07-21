"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import axios from "axios";
import GenerateHash from "@/lib/generateHash";
import SearchParamBuilder from "@/lib/searchParamBuilder";

async function getData(code: string) {
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
        return {};
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
        .catch(e => console.log("Error 2"));

    if (!resp2?.data) return {};

    const user = resp2?.data.user;

    const existingUser: any = await axios
        .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/user` +
                SearchParamBuilder({
                    quaver_id: user.id,
                    pw: process.env.SERVER_PW,
                })
        )
        .catch(e => console.log("Error 3"));

    if (existingUser?.data.status === 200) {
        return { user: existingUser?.data.user };
    }

    const userData: Prisma.UserCreateInput = {
        quaver_id: user.id,
        username: user.username,
        avatar: user.avatar,
        hash: GenerateHash(user.id),
    };

    let errored = false;

    const newUser = await axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            user: userData,
            pw: process.env.SERVER_PW,
        })
        .catch(e => {
            errored = true;
        });

    if (errored) return {};

    return { user: newUser };
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const userResponse = await getData(searchParams.code ?? "");

    if (userResponse.user) {
        redirect(
            `/` +
                SearchParamBuilder({
                    user_id: userResponse.user.user_id,
                    hash: userResponse.user.hash,
                })
        );
    }

    redirect("/");
}
