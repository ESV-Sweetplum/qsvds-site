"use client";

import SearchParamBuilder from "@/lib/searchParamBuilder";
import styles from "./navBar.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";

const permittedIDs=[1, 3]

export default function NavBar() {
    const [id, setID] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        setUsername(localStorage.getItem("username") ?? "");
        setID(localStorage.getItem("id") ?? "");
    });

    return (
        <div className={styles.navBar}>
            <div className={styles.navigation}>
                <NavLink href="/" text="Home" />
                <NavLink href="/maps" text="Maps" />
                {permittedIDs.includes(parseInt(id)) ? <NavLink href="/admin" text="Admin" /> : <></>}
            </div>
            {username ? (
                <div className={styles.dropdown}>
                    <div className={styles.login}>{username}</div>
                    <div className={styles.downArrow} />
                    <div className={styles.dropdownContent}>
                        <Link href="/logout">Logout</Link>
                    </div>
                </div>
            ) : (
                <a
                    href={
                        `https://quavergame.com/oauth2/authorize` +
                        SearchParamBuilder({
                            client_id: process.env.NEXT_PUBLIC_QUAVER_CLIENT_ID,
                            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
                            response_type: "code",
                        })
                    }
                    className={styles.login}
                >
                    Login
                </a>
            )}
        </div>
    );
}

interface NavLinkProps {
    href: string;
    text: string;
}

export function NavLink(props: NavLinkProps) {
    return (
        <Link className={styles.link} href={props.href}>
            {props.text}
        </Link>
    );
}
