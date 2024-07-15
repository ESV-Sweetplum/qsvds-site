"use client";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Calligraphy from "../../public/calligraphy.svg";
import styles from "./index.module.scss";
import { Button, Container, Section, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { useEffect, useState } from "react";
import { useMouse, useWindowSize } from "@uidotdev/usehooks";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function HomePage() {
    const [state, _] = useMouse();
    const { width, height } = useWindowSize();

    const [bgAngle, setBGAngle] = useState<number>(135);
    const [bgPercentPos, setBGPercentPos] = useState<number[]>([0, 0]);

    useEffect(() => {
        if (!width || !height) return;

        const pW = state.x / width;
        const pH = state.y / height;

        const dx = pW - 0.5;
        const dy = pH - 0.5;

        const angle = (Math.atan(dy / dx) * 180) / Math.PI;
        setBGAngle(angle + (dx >= 0 ? 180 : 0));
        setBGPercentPos([pW, pH]);
    }, [state]);

    return (
        <>
            <div className={styles.vignette} />
            <div
                className={styles.background}
                style={{
                    background: `radial-gradient(circle at ${bgPercentPos[0] * 100}% ${bgPercentPos[1] * 100}%, rgb(64, 3, 77), var(--accent-1))`,
                }}
            />
            <ScrollDownIndicator stopDisplayingAt={120} />
            <Container>
                <Section className={styles.lander}>
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
                        <Text size="4">Progression Guide</Text>
                        <DoubleArrowRightIcon />
                    </Button>
                    <Section className={styles.calligraphyBG}>
                        <Image
                            src={Calligraphy}
                            alt="Calligraphy"
                            width={600}
                        />
                    </Section>
                </Section>
            </Container>
        </>
    );
}
