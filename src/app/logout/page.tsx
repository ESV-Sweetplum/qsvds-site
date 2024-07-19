"use client";

import { useRouter } from "next/navigation";
import "../../styles/global.scss";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        deleteLocalStorage();
        router.push("/");
        router.refresh();
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
            Logging you out...
        </div>
    );
}

function deleteLocalStorage() {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("quaver_id");
    localStorage.removeItem("avatar");
    localStorage.removeItem("hash");
}
