"use client";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import Calligraphy from "../../public/calligraphy.svg";
import styles from "./index.module.scss";
import { Button, Container, Section, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { useMouse, useWindowSize } from "@uidotdev/usehooks";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

const paths = [
    [0.45, 0.35, 0.7, 0.55],
    [0.55, 0.4, 0.55, 0.45],
    [0.5, 0.7, 0.3, 0.5],
];

export default function HomePage() {
    const [state, _] = useMouse();
    const { width = 0, height = 0 } = useWindowSize();

    const [fade, setFade] = useState<boolean>(false);
    const [bgPercentPos, setBGPercentPos] = useState<number[]>([0, 0]);

    const canvasRef: LegacyRef<HTMLCanvasElement> = useRef(null);

    useEffect(() => {
        if (!width || !height) return;

        const pW = state.x / width;
        const pH = state.y / height;

        const dx = pW - 0.5;
        const dy = pH - 0.5;

        setBGPercentPos([pW, pH]);
    }, [state]);

    useEffect(() => {
        // setFade(true);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        const widthResolution = 1920;

        canvas.width = widthResolution;
        canvas.height = (widthResolution / 1920) * 1080;

        const width = canvas.width;
        const height = canvas.height;

        ctx.lineWidth = 1;
        const heightDelta = 1;
        const pipeRatio = 8;

        let heightDiff = 0;
        let gradientDiff = 0;

        const sqrt3o2 = 0.866025404;

        ctx.transform(
            1.5 * sqrt3o2,
            0.75,
            -1,
            sqrt3o2 * 2,
            (width / 2) * (1 - (3 * sqrt3o2) / 2) + height * 0.5,
            -0.375 * width + height * (0.5 - sqrt3o2)
        );

        let previousTime: number = Date.now();

        function animate(ctx: CanvasRenderingContext2D, currentTime: number) {
            const dt = currentTime - previousTime;

            if (!ctx) return;

            const gradient = ctx.createLinearGradient(
                0,
                0 - gradientDiff,
                0,
                height * 3 - gradientDiff
            );

            const color1 = "transparent";
            const color2 = "#6e56cf";

            gradient.addColorStop(0, color1);
            gradient.addColorStop(0.1666, color2);
            gradient.addColorStop(0.3333, color1);
            gradient.addColorStop(0.5, color2);
            gradient.addColorStop(0.6666, color1);
            gradient.addColorStop(0.8333, color2);
            gradient.addColorStop(1, color1);

            ctx.strokeStyle = gradient;

            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();

            for (let i = -2; i <= 0; i++) {
                paths.forEach(arr => {
                    ctx.moveTo(
                        Math.floor(width * arr[0]),
                        Math.floor(height * i + heightDiff)
                    );
                    ctx.bezierCurveTo(
                        Math.floor(arr[1] * width),
                        Math.floor(height * (0.333 + i) + heightDiff),
                        Math.floor(arr[2] * width),
                        Math.floor(height * (0.666 + i) + heightDiff),
                        Math.floor(arr[3] * width),
                        Math.floor(height * (1 + i) + heightDiff)
                    );
                });
            }

            ctx.stroke();
            ctx.closePath();

            heightDiff += (heightDelta * dt) / 20;
            gradientDiff += (heightDelta * pipeRatio * dt) / 20;

            if (gradientDiff >= height * 1.5) gradientDiff -= height;
            if (heightDiff >= height * 1.5) heightDiff -= height;

            previousTime = currentTime;

            requestAnimationFrame(() => animate(ctx, Date.now()));
        }

        animate(ctx, Date.now());
    }, []);

    return (
        <>
            <div className={styles.vignette} />
            <div
                className={styles.background}
                // style={{
                //     background: `radial-gradient(circle at ${bgPercentPos[0] * 100}% ${bgPercentPos[1] * 100}%, var(--violet-3), var(--accent-1))`,
                // }}
            />
            <div className={styles.backgroundNoise} />
            <ScrollDownIndicator
                stopDisplayingAt={120}
                style={{ opacity: +fade }}
            />
            <canvas
                className={styles.canvas}
                ref={canvasRef}
                style={{
                    opacity: +fade,
                }}
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
                            onLoad={_ => setFade(true)}
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
            <Container className={styles.introduction}>
                <Section>
                    Greetings, my name is Beef, and today I would like to
                    present an exceedingly excellent Your Mother joke. Your 👉
                    biological 🐘 mother 👩 is so morbidly obese 🎅, when 🍑 she
                    👧 went 🏃 to go 🏃 get 🉐 her 👩 yearly 📅 physical 👊🌟
                    done ✅, the doctor 👨‍⚕️ took 👫 her 👩 blood 💉🛁 and the
                    results 👀💯 concluded that she 👩 had a high 🕛 blood 💉
                    pressure 🛃, onset Type 💻 2 ✌ Diabetes ❤, hypertension,
                    and the possibility 🤔 of heart 💔 disease 😷. She 👩🏾 also
                    👨 suffers 😣😫😖 from severe 👎😡👺 depression 😥😭🎭,
                    because she 👩 lacks 📉 confidence 😎 in her 👩🏻 physical 👊
                    appearance 🔎, which enables 😺 her 👩 to consume 👅 even 🌃
                    more food 🐟🍜, making 🖕 her 👩 more obese 🇺🇸. Not to
                    mention 🗣, but 🍑 your 👉🚪 mother 👵 is becoming 😔 so
                    monstrous 👹👺, she 👩 had a hard 🍆 time 🕐 fitting 😂
                    through small 👌 spaces 🚀👾 and exceeding weight ⚖ limits
                    ⌛ on 🔛 practical 😚 applications 📄. Your 👉 mother 👵🎨
                    has an endless 🔄 cycle 🔄 of malicious 🔫 eating 👅 habits
                    😵😱 that only make 💘 her 👩 health 🚑 worsen 😓😩 over
                    😳🙊💦 time 🕐🕟. I 👁 hope 🙏 whoever 👤 has just watched
                    👀 this video 📹 enjoyed 🤤 the humorous 🤣😂👍 Your 👉
                    Mother 👵 joke 😂🤡😡. Thank 🙏 you 👉🏻 for you 👈 time 🕐👋
                    and have a blessed 🙏 day 🌞.
                </Section>
            </Container>
        </>
    );
}
