import styles from "./userCard.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import User from "@/interfaces/user";

interface UserCardProps {
    user?: User;
}

export default function UserCard(props: UserCardProps) {
    const router = useRouter();

    return (
        <>
            {props.user ? (
                <div
                    className={styles.userCard}
                    onMouseDown={e => {
                        switch (e.button) {
                            case 2:
                                break;
                            case 1:
                                window.open(
                                    `/user/${props.user?.user_id || 0}`,
                                    "_blank",
                                    "noopener noreferrer"
                                );
                                break;
                            default:
                                router.push(`/user/${props.user?.user_id || 0}`);
                        }
                    }}
                >
                    <div className={styles.avatar}>
                        <Image
                            src={props.user.avatar}
                            alt="bruh"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <div className={styles.nameRatingDisplay}>
                        <div className={styles.nameDisplay}>
                            {props.user.username}
                        </div>
                        <div className={styles.ratingDisplay}>
                            Submitted {props.user.ratings?.length ?? 0} Ratings
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
