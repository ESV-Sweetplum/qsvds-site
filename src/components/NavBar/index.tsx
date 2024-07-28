"use client";

import { Avatar, Button, DropdownMenu, Text } from "@radix-ui/themes";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import styles from "./navBar.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { User } from "@prisma/client";
import { Logout } from "@/app/actions";

const permittedIDs = [1, 3, 5];

interface NavbarProps {
    user?: User | null;
    hash?: string;
}

export default function NavBar({ user, hash }: NavbarProps) {
    const router = useRouter();
    const path = usePathname();

    const [showBG, setShowBG] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [windowScrollValue, setWindowScroll] = useState(0);

    useEffect(() => {
        function checkValidity() {
            if (user?.hash === hash || !user) return;
            Logout();
            router.push("/");
            router.refresh();
        }

        checkValidity();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        window.addEventListener("scroll", () => {
            if (window.scrollY >= 80) {
                setShowBG(true);
            }
            if (window.scrollY < 80) {
                setShowBG(false);
            }
            setWindowScroll(window.scrollY);
        });
    });

    return (
        <nav
            className={styles.navBar}
            style={{
                backgroundColor: showBG ? "var(--accent-3)" : "rgba(0,0,0,0)",
                backdropFilter: showBG ? "blur(10px)" : "none",
                marginTop: `${path === "/" ? Math.max(35 - windowScrollValue, 0) : 0}px`,
            }}
        >
            <section className={styles.home} onClick={() => router.push("/")}>
                <Image
                    src={Logo}
                    alt="bruh"
                    width={50}
                    height={50}
                    unoptimized
                    style={{
                        filter: `drop-shadow(1px 1px 1px var(--accent-8))`,
                    }}
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
                {user ? (
                    <>
                        {permittedIDs.includes(user.user_id) ? (
                            <LockClosedIcon
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
                                        src={user.avatar}
                                        fallback="pfp"
                                        style={{ marginRight: "5px" }}
                                    />
                                    <Text size="5">{user.username}</Text>
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
                                    onClick={() =>
                                        router.push(`/user/${user.user_id}`)
                                    }
                                >
                                    View My Profile
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => Logout()}>
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
