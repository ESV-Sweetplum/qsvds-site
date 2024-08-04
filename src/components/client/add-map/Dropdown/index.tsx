import { Dispatch, SetStateAction, useState } from "react";
import styles from "./dropdown.module.scss";

interface DropdownProps {
    selection: string;
    setSelection: Dispatch<SetStateAction<string>>;
    options: string[];
}

export default function Dropdown(props: DropdownProps) {
    async function selectItem(idx: number) {
        props.setSelection(props.options[idx]);
    }

    return (
        <div className={styles.dropdown}>
            <div className={styles.selectedItem}>{props.selection}</div>
            <div className={styles.dropdownOptions}>
                {props.options.map((option, idx) => (
                    <div
                        className={styles.option}
                        key={idx}
                        onClick={() => selectItem(idx)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}
