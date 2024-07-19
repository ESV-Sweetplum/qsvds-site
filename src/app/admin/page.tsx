"use client";

import { useEffect, useState } from "react";
import "../../styles/global.scss";
import styles from "./admin.module.scss";
import MapDocument from "@/interfaces/mapDocument";
import { Title } from "@/components/Typography/typography";
import { Textfit } from "react-textfit";
import { Category } from "@/interfaces/category";
import Loading from "@/components/Loading";
import SearchParamBuilder from "@/lib/searchParamBuilder";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    const [docs, setDocs] = useState<MapDocument[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getMaps() {
            const userResp = await fetch(
                `/api/user?user_id=${localStorage.getItem("id") || 0}`
            ).then(r => r.json());

            if (!userResp.user) router.push("/");
            if (userResp.user.role !== "Administrator") router.push("/");

            const resp = await fetch(
                `/api/maps` +
                    SearchParamBuilder({
                        limited: false,
                        quaver_id: localStorage.getItem("quaver_id") || 0,
                        hash: localStorage.getItem("hash") || "",
                    })
            ).then(r => r.json());

            setDocs(resp.maps);
            setCategories(resp.maps.map((doc: MapDocument) => doc.category));
            setLoading(false);
        }

        getMaps();
    }, []);

    async function changeCategory(id: number, idx: number, category: string) {
        setLoading(true);
        const tempCategories = [...categories];
        tempCategories[idx] = category;

        setCategories(tempCategories);

        const tempDocs = [...docs];
        tempDocs[idx].category = category as Category;

        setDocs(tempDocs);

        const resp = await fetch(`/api/category`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                category,
                user_quaver_id: localStorage.getItem("quaver_id") || 0,
                hash: localStorage.getItem("hash") || "",
            }),
        }).then(r => r.json());

        setLoading(false);
    }

    return (
        <>
            <Loading loadingStatus={loading} />
            <main
                style={{
                    opacity: 1 - +loading * 0.5,
                    pointerEvents: loading ? "none" : "all",
                }}
            >
                <Title>Admin</Title>
                {docs.map((doc, docIdx) => (
                    <div className={styles.mapDoc} key={docIdx}>
                        <div className={styles.id}>{doc.map_id}</div>
                        <div className={styles.separator}></div>
                        <div className={styles.quaver_id}>{doc.mapQua.id}</div>
                        <div className={styles.separator}></div>
                        <div className={styles.title}>
                            <Textfit mode="single" max={12}>
                                {doc.mapQua.title}
                            </Textfit>
                        </div>
                        <div className={styles.separator}></div>
                        <div className={styles.diffName}>
                            <Textfit mode="single" max={12}>
                                {doc.mapQua.difficulty_name}
                            </Textfit>
                        </div>
                        <div className={styles.separator}></div>
                        <div className={styles.creator}>
                            {doc.mapQua.creator_username}
                        </div>
                        <div className={styles.separator}></div>
                        <select
                            className={styles.category}
                            onChange={e =>
                                changeCategory(doc.map_id, docIdx, e.target.value)
                            }
                            value={doc.category}
                        >
                            {[
                                "Reading",
                                "Hybrid",
                                "Memory",
                                "Reverse",
                                "Splitscroll",
                            ].map((item, idx) => (
                                <option value={item} key={idx}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </main>
        </>
    );
}
