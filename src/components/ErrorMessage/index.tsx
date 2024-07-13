import styles from "./errorMessage.module.scss";

interface ErrorMessageProps {
    errorText: string;
    errorTriggered: boolean;
}

export default function ErrorMessage(props: ErrorMessageProps) {
    return (
        <div
            className={styles.error}
            style={
                props.errorTriggered
                    ? { bottom: "30px", opacity: 1 }
                    : {
                          bottom: "-70px",
                          opacity: 0,
                          transition: "opacity 0.5s, bottom 0.3s",
                      }
            }
        >
            {props.errorText}
        </div>
    );
}
