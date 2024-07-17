"use client";
import Image from "next/image";
import TwirlyThing from "../../public/twirlything.svg";
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
    [0.45, 0.35, 0.7, 0.55],
    [0.55, 0.4, 0.55, 0.45],
    [0.5, 0.7, 0.3, 0.5],
];

export default function HomePage() {
    const [state, _] = useMouse();
    const { width = 0, height = 0 } = useWindowSize();

    const [bgAngle, setBGAngle] = useState<number>(135);
    const [fade, setFade] = useState<boolean>(false);
    const [bgPercentPos, setBGPercentPos] = useState<number[]>([0, 0]);

    useEffect(() => {
        if (!width || !height) return;

        const pW = state.x / width;
        const pH = state.y / height;

        // const dx = pW - 0.5;
        // const dy = pH - 0.5;

        // const angle = (Math.atan(dy / dx) * 180) / Math.PI;
        // setBGAngle(angle + (dx >= 0 ? 180 : 0));
        setBGPercentPos([pW, pH]);
    }, [state]);

    return (
        <>
            <div className={styles.vignette} />
            <div
                className={styles.background}
                style={{
                    background: `radial-gradient(circle at ${bgPercentPos[0] * 100}% ${bgPercentPos[1] * 100}%, var(--violet-3), var(--accent-1))`,
                }}
            />
            <div className={styles.waveWrapper} />
            <div className={styles.backgroundNoise} />
            <ScrollDownIndicator
                stopDisplayingAt={120}
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
                <Section className={styles.introduction}>
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
