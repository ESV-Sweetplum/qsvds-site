"use client";

import styles from "./map.module.scss";
import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import "../../../styles/global.scss";
import { useEffect, useState } from "react";
import Map from "@/interfaces/map";
import UserRating from "@/interfaces/userRating";
import { Category } from "@/interfaces/category";
import Loading from "@/components/Loading";
import RatingDisplay from "@/components/RatingDisplay";
import _ from "lodash";
import { Textfit } from "react-textfit";

export default function MapPage({ params }: { params: { quaver_id: number } }) {
    const router = useRouter();

    const [map, setMap] = useState<Partial<Map>>({});
    const [totalRating, setTotalRating] = useState<number>(0);
    const [submittedRating, setSubmittedRating] = useState<string>("-1");
    const [userRating, setUserRating] = useState<string>("-1");
    const [ratings, setRatings] = useState<UserRating[]>([]);
    const [category, setCategory] = useState<Category | "">("");

    const [loading, setLoading] = useState<boolean>(true);
    const [submittingRating, setSubmittingRating] = useState<boolean>(false);

    useEffect(() => {
        async function getMap() {
            const resp = await fetch(
                `/api/map?quaver_id=${params.quaver_id}`
            ).then(r => r.json());
            const resp2 = await fetch(
                `/api/ratings?id=${params.quaver_id}`
            ).then(r => r.json());

            const userRating =
                resp2.ratings.filter(
                    (r: UserRating) =>
                        r.user_id ===
                        parseInt(localStorage.getItem("id") ?? "-1e50")
                )[0]?.rating ?? "-1";

            setUserRating(userRating);

            setTotalRating(resp.map.totalRating);
            setSubmittedRating(userRating);
            setCategory(resp.map.category);
            setRatings(resp2.ratings);
            setMap(resp.map.map);
            setLoading(false);
        }

        getMap();
    }, []);

    async function submitRating() {
        if (parseInt(userRating) <= 0) return;

        setSubmittingRating(true);
        const resp = await fetch("/api/rating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: localStorage.getItem("id"),
                quaver_id: localStorage.getItem("quaver_id"),
                user_hash: localStorage.getItem("hash"),
                rating: userRating,
                map_id: map.id,
            }),
        }).then(r => r.json());

        if (resp.status !== 200) {
            console.log(resp);
            setSubmittingRating(false);
            return;
        }

        setSubmittedRating(userRating);
        setTotalRating(resp.newTotalRating);
        setRatings(resp.newRatings);
        setSubmittingRating(false);
    }

    return (
        <>
            <Loading loadingStatus={loading || submittingRating} />
            <main
                style={{
                    opacity: +!loading,
                    transition: "opacity 0.3s",
                    pointerEvents: submittingRating || loading ? "none" : "all",
                }}
            >
                <div className={styles.bannerImage}>
                    <Image
                        src={`https://cdn.quavergame.com/mapsets/${map.mapset_id}.jpg`}
                        alt={`banner`}
                        fill
                        style={{ objectFit: "cover", filter: "blur(5px)" }}
                    />
                </div>
                <div className={styles.bannerText}>
                    <Textfit mode="single" max={48}>
                        {map.artist} - {map.title}
                    </Textfit>
                    <Textfit mode="single" max={32}>
                        By: {map.creator_username} - [{map.difficulty_name}] (
                        {map.difficulty_rating?.toFixed(2)})
                    </Textfit>
                </div>

                <div className={styles.ratingCard}>
                    <div className={styles.ratingStatsSection}>
                        <div className={styles.totalRatingDisplay}>
                            <div>
                                <RatingDisplay
                                    rating={totalRating}
                                    category={category}
                                    range={[0, 60]}
                                    style={{
                                        zIndex: 69,
                                        opacity: 1,
                                        position: "relative",
                                        margin: 0,
                                    }}
                                    scale={0.7}
                                />
                            </div>
                            from {ratings.length} rating
                            {ratings.length >= 2 ? "s" : ""}
                        </div>
                        <div className={styles.ratingHistogram}></div>
                    </div>
                    <div className={styles.ratingAddSection}>
                        Your Rating -{" "}
                        {submittedRating === "-1" ? "NONE" : submittedRating}
                        <input
                            type="number"
                            value={userRating === "-1" ? "0" : userRating}
                            onChange={e =>
                                setUserRating(
                                    _.clamp(
                                        parseInt(e.target.value) || 0,
                                        0,
                                        60
                                    ).toString()
                                )
                            }
                        />
                        <button
                            className={styles.ratingSubmitButton}
                            onClick={submitRating}
                        >
                            submit LOL
                        </button>
                    </div>
                </div>
                <div className={styles.ratingList}>
                    {ratings.map(rating => (
                        <div className={styles.rating} key={rating.user_id}>
                            {rating.user_id} - {rating.rating}
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
