"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "../../styles/global.scss";
import { useEffect, useState } from "react";
import User from "@/interfaces/user";

export default function LoginPage() {
    const [loadingText, setText] = useState<string>("Logging you in...");
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const code = params.get("code");

        async function main() {
            const resp = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: code }),
            }).then(r => r.json());

            if (resp.status !== 200) {
                setText(resp.message);
                router.push("/");
                router.refresh();
                return;
            }

            setText("Done!");
            console.log(resp);
            setLocalStorage(resp.user);
            router.push("/");
            router.refresh();
        }

        main();
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
                color: "white",
                fontSize: "5rem",
                zIndex: "69",
                display: "grid",
                placeItems: "center",
                textShadow: "2px 2px 5px black",
            }}
        >
            {loadingText}
        </div>
    );
}

function setLocalStorage(user: User) {
    localStorage.setItem("id", user.id.toString());
    localStorage.setItem("username", user.username);
    localStorage.setItem("quaver_id", user.quaver_id.toString());
    localStorage.setItem("avatar", user.avatar);
    localStorage.setItem("hash", user.hash);
}
