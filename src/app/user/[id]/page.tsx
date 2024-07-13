"use client";

import styles from "./user.module.scss";
import Image from "next/image";

import { useRouter } from "next/navigation";
import "../../../styles/global.scss";
import { useEffect, useState } from "react";
import User from "@/interfaces/user";
import UserRating from "@/interfaces/userRating";
import Loading from "@/components/Loading";
import _ from "lodash";
import { Textfit } from "react-textfit";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { Title } from "@/components/Typography/typography";
import MapCard from "@/components/MapCard";

const monthArr =
    "January February March April May June July August September October November December".split(
        " "
    );

export default function MapPage({ params }: { params: { id: number } }) {
    const router = useRouter();

    const [user, setUser] = useState<Partial<User>>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getUser() {
            const resp = await fetch(
                "/api/user" +
                    SearchParamBuilder({ id: params.id, includeRatings: true })
            ).then(resp => resp.json());

            setUser(resp.user);

            console.log(resp.user);
            setLoading(false);
        }

        getUser();
    }, []);

    return (
        <>
            <Loading loadingStatus={loading} />
            <main
                style={{
                    opacity: +!loading,
                    transition: "opacity 0.3s",
                    pointerEvents: loading ? "none" : "all",
                }}
            >
                {user ? (
                    <>
                        <div className={styles.userInfo}>
                            <div className={styles.userImage}>
                                <Image
                                    src={user.avatar || ""}
                                    alt={`${user.username}'s PFP`}
                                    fill
                                />
                            </div>
                            <div className={styles.userText}>
                                <div className={styles.username}>
                                    {user.username}
                                </div>
                                <div
                                    style={{
                                        fontSize: "2rem",
                                        marginTop: "20px",
                                    }}
                                >
                                    Joined on{" "}
                                    {
                                        monthArr[
                                            new Date(user.createdAt).getMonth()
                                        ]
                                    }{" "}
                                    {new Date(user.createdAt).getDay() + 1},{" "}
                                    {new Date(user.createdAt).getFullYear()}
                                </div>
                                <div style={{ fontSize: "1.5rem" }}>
                                    Submitted {user.ratings?.length} Ratings
                                </div>
                            </div>
                        </div>
                        <Title>Submitted Ratings</Title>
                        <div className={styles.mapGrid}>
                            {user.ratings?.length ? (
                                user.ratings?.map((rating, idx) => {
                                    if (!rating.map) return <></>;

                                    return (
                                        <MapCard
                                            key={idx}
                                            map={rating.map.map}
                                            rating={rating.rating}
                                            category={rating.map.category}
                                            clickable
                                            baseline={rating.map.baseline}
                                            banned={rating.map.banned}
                                        />
                                    );
                                })
                            ) : (
                                <>NO RATINGS SUBMITTED</>
                            )}
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </main>
        </>
    );
}
