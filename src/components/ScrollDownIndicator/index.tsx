import { useWindowScroll } from "@uidotdev/usehooks";
import styles from "./scrollDownIndicator.module.scss";
import { useEffect, useState } from "react";
import { Container, Flex } from "@radix-ui/themes";
import ScrollIcon from "../../../public/scroll.svg";
import { CursorArrowIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface ScrollDownIndicatorProps {
    stopDisplayingAt: number;
}

export default function ScrollDownIndicator(props: ScrollDownIndicatorProps) {
    const [{ y }, __] = useWindowScroll();
    const [visible, setVisibility] = useState<boolean>(true);

    useEffect(() => {
        if ((y ?? 0) > props.stopDisplayingAt) setVisibility(false);
        if ((y ?? 0) <= props.stopDisplayingAt) setVisibility(true);
    }, [y]);

    return (
        <Flex
            className={styles.container}
            style={{ opacity: +visible }}
            direction={"column"}
            justify={"center"}
            align={"center"}
        >
            <Image
                src={ScrollIcon}
                alt="Scroll Icon"
                width={60}
                height={90}
                unoptimized
                style={{ opacity: +visible }}
            />
            <DoubleArrowDownIcon
                width={30}
                height={30}
                style={{ opacity: +visible }}
            />
        </Flex>
    );
}
