"use client";

import { Avatar, Button, DropdownMenu, Text } from "@radix-ui/themes";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import styles from "./navBar.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon, TrashIcon } from "@radix-ui/react-icons";

const permittedIDs = [1, 3, 5];

export default function NavBar() {
    const path = usePathname();
    const router = useRouter();

    const [id, setID] = useState<string>("");
    const [avatarLink, setAvatarLink] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [showBG, setShowBG] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const id = localStorage.getItem("id") ?? "";
        setAvatarLink(localStorage.getItem("avatar") ?? "");
        setUsername(localStorage.getItem("username") ?? "");
        setID(id);

        if (path.includes("admin") && !permittedIDs.includes(parseInt(id))) {
            router.push("/");
        }

        window.addEventListener("scroll", () => {
            if (window.scrollY >= 80) {
                setShowBG(true);
            }
            if (window.scrollY < 80) {
                setShowBG(false);
            }
        });
    });

    return (
        <nav
            className={styles.navBar}
            style={{
                backgroundColor: showBG ? "var(--accent-2)" : "rgba(0,0,0,0)",
            }}
        >
            <section className={styles.home} onClick={() => router.push("/")}>
                <Image
                    src={Logo}
                    alt="bruh"
                    width={50}
                    height={50}
                    unoptimized
                    style={{ filter: `drop-shadow(1px 1px 5px white)` }}
                />
                <Text size="8" weight="bold">
                    QSVDS
                </Text>
            </section>
            <section className={styles.primaryLinks}>
                <NavLink href="/maps" text="Maps" />
                <NavLink href="/users" text="Users" />
                <NavLink href="/" text="Progression" />
                <NavLink href="/" text="Courses" />
            </section>
            <section className={styles.userData}>
                {username ? (
                    <>
                        {permittedIDs.includes(parseInt(id)) ? (
                            <TrashIcon
                                onClick={() => router.push("/admin")}
                                width={20}
                                height={20}
                                cursor="pointer"
                            />
                        ) : (
                            <></>
                        )}
                        <DropdownMenu.Root
                            open={dropdownOpen}
                            onOpenChange={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <DropdownMenu.Trigger>
                                <Button
                                    style={{
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Avatar
                                        src={avatarLink}
                                        fallback="pfp"
                                        style={{ marginRight: "5px" }}
                                    />
                                    <Text size="5">{username}</Text>
                                    <ChevronDownIcon
                                        style={{
                                            transform: `rotate(${+dropdownOpen * 180}deg)`,
                                            transition: "transform 0.3s",
                                        }}
                                    />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content align="end">
                                <DropdownMenu.Item
                                    onClick={() => router.push(`/user/${id}`)}
                                >
                                    View My Profile
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => router.push("/logout")}
                                >
                                    Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </>
                ) : (
                    <a
                        href={
                            `https://quavergame.com/oauth2/authorize` +
                            SearchParamBuilder({
                                client_id:
                                    process.env.NEXT_PUBLIC_QUAVER_CLIENT_ID,
                                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
                                response_type: "code",
                            })
                        }
                        className={styles.login}
                    >
                        <Text weight="medium" size="5">
                            Login
                        </Text>
                    </a>
                )}
            </section>
        </nav>
    );
}

interface NavLinkProps {
    href: string;
    text: string;
}

export function NavLink(props: NavLinkProps) {
    return (
        <Link className={styles.link} href={props.href}>
            <Text weight={"medium"} size={"5"}>
                {props.text}
            </Text>
        </Link>
    );
}
