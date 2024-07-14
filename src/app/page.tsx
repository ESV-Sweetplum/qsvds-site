"use client";

import { Title } from "@/components/Typography/typography";
import styles from "./index.module.scss";
import "../styles/global.scss";
import { useEffect, useState } from "react";
import { useMouse, useWindowSize } from "@uidotdev/usehooks";

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
            <main className={styles.main}>
                <Title>zeph will design this later LOL</Title>
            </main>
        </>
    );
}
