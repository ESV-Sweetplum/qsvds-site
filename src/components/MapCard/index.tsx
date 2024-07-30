import MapQua from "@/interfaces/mapQua";
import styles from "./mapCard.module.scss";
import Image from "next/image";
import RatingDisplay from "../RatingDisplay";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MapCardProps {
    map?: Partial<MapQua>;
    rating?: number;
    category?: string;
    emptyText?: string;
    scale?: number;
    clickable?: boolean;
    baseline?: boolean;
    banned?: boolean;
    ranked?: boolean;
}

export default function MapCard(props: MapCardProps) {
    const router = useRouter();

    return (
        <div
            className={styles.mapCard}
            style={{
                scale: props.scale ?? 1,
                cursor: props.clickable ? "pointer" : "default",
            }}
            onMouseDown={e => {
                if (props.clickable) {
                    switch (e.button) {
                        case 2:
                            break;
                        case 1:
                            window.open(
                                `/map/${props.map?.id || 0}`,
                                "_blank",
                                "noopener noreferrer"
                            );
                            break;
                        default:
                            router.push(`/map/${props.map?.id || 0}`);
                    }
                }
            }}
        >
            {props.map ? (
                <>
                    <Image
                        src={`https://cdn.quavergame.com/mapsets/${props.map.mapset_id}.jpg`}
                        alt="bruh"
                        fill
                        className={styles.cardBG}
                    />
                    <div className={styles.mapInfo}>
                        <div className={styles.title}>{props.map.title}</div>
                        <div className={styles.difficulty}>
                            {props.map.artist} - [
                            {(props.map.game_mode as number) * 3 + 1}K]{" "}
                            {props.map.difficulty_rating?.toFixed(2)} -{" "}
                            {props.map.difficulty_name}
                        </div>
                        <div className={styles.creator}>
                            Made by{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "rgb(0,255,255)",
                                    cursor: "pointer",
                                }}
                                href={`https://quavergame.com/user/${props.map.creator_id}`}
                            >
                                {props.map.creator_username}
                            </a>
                        </div>
                    </div>
                    <div className={styles.rating}>
                        {props.ranked ? (
                            <div
                                className={styles.labelDiv}
                                style={{
                                    backgroundColor: "rgb(0,255,0)",
                                    color: "black",
                                }}
                            >
                                RANKED
                            </div>
                        ) : (
                            <></>
                        )}
                        {props.baseline ? (
                            <div
                                className={styles.labelDiv}
                                style={{ backgroundColor: "rgb(255, 242, 0)" }}
                            >
                                BASELINE
                            </div>
                        ) : (
                            <></>
                        )}
                        {props.banned ? (
                            <div
                                className={styles.labelDiv}
                                style={{
                                    backgroundColor: "rgb(255,0,0)",
                                    color: "white",
                                }}
                            >
                                BANNED
                            </div>
                        ) : (
                            <></>
                        )}
                        <RatingDisplay
                            rating={props.rating ?? 1}
                            range={[0, 60]}
                            category={props.category}
                            style={{ opacity: 1 }}
                            scale={0.8}
                        />
                    </div>
                </>
            ) : (
                <div className={styles.emptyMapText}>
                    {props.emptyText || ""}
                </div>
            )}
        </div>
    );
}
