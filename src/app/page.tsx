"use server";

import Image from "next/image";
import Logo from "../../public/logo.svg";
import Calligraphy from "../../public/calligraphy.svg";
import styles from "./index.module.scss";
import { Container, Section, Text } from "@radix-ui/themes";
import "../styles/global.scss";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";
import DynamicBackground from "@/components/DynamicBackground";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/client/home/LinkButton";

export default async function HomePage({
    searchParams,
}: {
    searchParams: { [key: string]: string };
}) {
    if (searchParams.hash) {
        revalidatePath("/");
        redirect("/");
    }

    return (
        <>
            <div
                style={{
                    width: "100vw",
                    height: "35px",
                    color: "white",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    gap: "4px",
                }}
            >
                Site development will be put on hold to focus on ESVT. We
                appreciate your patience.
            </div>
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
                    <LinkButton />
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
