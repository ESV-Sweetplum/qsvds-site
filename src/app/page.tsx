"use client";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import styles from "./index.module.scss";
import { Button, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { useEffect, useState } from "react";
import { useMouse, useWindowSize } from "@uidotdev/usehooks";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";

export default function HomePage() {
    const [state, _] = useMouse();
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (!width || !height) return;

        const pW = state.x / width;
        const pH = state.y / height;
    }, [state]);

    return (
        <>
            <div className={styles.vignette} />
            <div className={styles.background} />
            <main>
                <section className={styles.lander}>
                    <Text style={{ fontSize: "9rem" }} weight="light">
                        QS
                        <Image src={Logo} alt="bruh" width={108} height={108} />
                        DS
                    </Text>
                    <Button className={styles.landerButton} radius="large">
                        <Text size="4" color="iris">
                            Progression Guide
                        </Text>
                        <DoubleArrowRightIcon />
                    </Button>
                </section>
            </main>
        </>
    );
}
