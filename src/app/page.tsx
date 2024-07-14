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

    const [bgAngle, setBGAngle] = useState<number>(135);

    useEffect(() => {
        if (!width || !height) return;

        const pW = state.x / width;
        const pH = state.y / height;

        const dx = pW - 0.5;
        const dy = pH - 0.5;

        const angle = (Math.atan(dy / dx) * 180) / Math.PI;
        setBGAngle(angle + (dx >= 0 ? 180 : 0));
    }, [state]);

    return (
        <>
            <div className={styles.vignette} />
            <div
                className={styles.background}
                style={{
                    background: `linear-gradient(${bgAngle}deg, var(--accent-1), rgb(64, 3, 77))`,
                }}
            />
            <main>
                <section className={styles.lander}>
                    <Text weight="light" className={styles.landerTitle}>
                        QS
                        <Image
                            src={Logo}
                            alt="bruh"
                            width={108}
                            height={108}
                            unoptimized
                            style={{
                                filter: `drop-shadow(1px 1px 4px gray)`,
                            }}
                        />
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
