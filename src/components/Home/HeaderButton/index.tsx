"use client";

import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import styles from "./headerButton.module.scss";

export function HeaderButton() {
    const router = useRouter();

    return (
        <Button
            className={styles.landerButton}
            radius="large"
            onClick={() => router.push("/maps")}
        >
            <Text size="4">View Maps</Text>
            <DoubleArrowRightIcon />
        </Button>
    );
}
