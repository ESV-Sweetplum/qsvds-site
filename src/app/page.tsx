"use client";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Calligraphy from "../../public/calligraphy.svg";
import styles from "./index.module.scss";
import { Button, Container, Section, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { useEffect, useRef, useState } from "react";
import { useMouse, useWindowSize } from "@uidotdev/usehooks";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

const paths = [
    [0.65, 0.55, 0.9, 0.75],
    [0.75, 0.6, 0.75, 0.65],
    [0.7, 0.9, 0.5, 0.7],
];

export default function HomePage() {
    const [state, _] = useMouse();
    const { width = 0, height = 0 } = useWindowSize();

    const [bgAngle, setBGAngle] = useState<number>(135);
    const [fade, setFade] = useState<boolean>(false);
    const [bgPercentPos, setBGPercentPos] = useState<number[]>([0, 0]);

    const canvasRef: any = useRef(null);

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

    useEffect(() => {
        // setFade(true);

        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const widthResolution = 1920 * 2;

        canvas.width = widthResolution;
        canvas.height = (widthResolution / 1920) * 1080;

        const width = canvas.width;
        const height = canvas.height;

        ctx.lineWidth = 4;
        const pipeRatio = 2

        let heightDiff = 0;

        function animate(ctx: CanvasRenderingContext2D) {
            if (!ctx) return;

            const gradient = ctx.createLinearGradient(0, 0, 0, height);

            gradient.addColorStop(0, "black");
            gradient.addColorStop(0.5, "white");
            gradient.addColorStop(1, "black");
            
            ctx.strokeStyle = gradient;

            ctx.clearRect(0, 0, width, height);
            
            ctx.beginPath();

            for (let i = -2; i <= 0; i++) {
                paths.forEach(arr => {
                    ctx.moveTo(width * arr[0], height * i + heightDiff);
                    ctx.bezierCurveTo(
                        arr[1] * width,
                        height * (1 / 3 + i) + heightDiff,
                        arr[2] * width,
                        height * (2 / 3 + i) + heightDiff,
                        arr[3] * width,
                        height * (1 + i) + heightDiff
                    );
                });
            }
            ctx.stroke();
            ctx.closePath();
            heightDiff += 1.5;

            if (heightDiff >= height * 1.5) {
                heightDiff -= height
            }

            requestAnimationFrame(() => animate(ctx));
        }

        animate(ctx);
    }, []);

    return (
        <>
            <div className={styles.vignette} />
            <div
                className={styles.background}
                style={{
                    background: `radial-gradient(circle at ${bgPercentPos[0] * 100}% ${bgPercentPos[1] * 100}%, rgb(64, 3, 77), var(--accent-1))`,
                }}
            />
            <ScrollDownIndicator
                stopDisplayingAt={120}
                style={{ opacity: +fade }}
            />
            <canvas
                className={styles.canvas}
                ref={canvasRef}
                style={{ opacity: +fade }}
            />
            <Container>
                <Section className={styles.lander} style={{ opacity: +fade }}>
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
                            onLoad={e => setFade(true)}
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
