"use server";

import Image from "next/image";
import Logo from "../../public/logo.svg";
import Calligraphy from "../../public/calligraphy.svg";
import styles from "./index.module.scss";
import { Button, Container, Section, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";
import DynamicBackground from "@/components/DynamicBackground";
import { cookies } from "next/headers";

export default async function HomePage() {
    const cookieList = cookies().getAll();

    console.log(cookieList);
    return (
        <>
            <div className={styles.vignette} />
            <DynamicBackground />
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
                            priority
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
                            priority
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
