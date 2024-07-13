import { ReactNode } from "react";
import styles from "./typography.module.scss";

interface TitleProps {
    button?: JSX.Element;
    children: React.ReactNode;
}

export function Title(props: TitleProps) {
    return (
        <div
            className={styles.title}
            style={
                props.button
                    ? {
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                      }
                    : {}
            }
        >
            {props.children}
            {props.button ?? null}
        </div>
    );
}
