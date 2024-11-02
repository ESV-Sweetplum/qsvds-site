"use client";

import { useRouter } from "next/navigation";
import { Button, Text } from "@radix-ui/themes";
import styles from "./linkButton.module.scss";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";

export function LinkButton() {
    const router = useRouter();

    return (
        <Button
            className={styles.landerButton}
            radius="large"
            onClick={() => {
                router.push("/maps");
            }}
        >
            <Text size="4">View Maps</Text>
            <DoubleArrowRightIcon />
        </Button>
    );
}
