"use client";

import { useEffect, useState } from 'react';
import "../../styles/global.scss";
import styles from "./admin.module.scss"
import MapDocument from '@/interfaces/mapDocument';
import { Title } from '@/components/Typography/typography';
import { Textfit } from 'react-textfit';
import { Category } from '@/interfaces/category';
import Loading from '@/components/Loading';
import SearchParamBuilder from '@/lib/searchParamBuilder';

export default function AdminPage() {

  const [docs, setDocs] = useState<MapDocument[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getMaps() {
    const resp = await fetch(
      `/api/maps` + SearchParamBuilder({
        limited: false,
        quaver_id: localStorage.getItem("quaver_id") || 0,
        hash: localStorage.getItem("hash") || ""
      }))
  .then((resp) => resp.json());

  setDocs(resp.maps);
  setCategories(resp.maps.map((doc: MapDocument) => doc.category))
  setLoading(false)
    }

    getMaps()
}, []);

async function changeCategory(id: number, idx: number, category: string) {
  setLoading(true)
  const tempCategories = [...categories]
  tempCategories[idx] = category

  setCategories(tempCategories)

  const tempDocs = [...docs]
  tempDocs[idx].category = category as Category

  setDocs(tempDocs)

  const resp = await fetch(`/api/category`, {
    method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                    category,
                }),
  }).then((resp) => resp.json())

  setLoading(false)
}

  return <>
    <Loading loadingStatus={loading}/>
  <main style={{opacity: 1 - +loading * 0.5, pointerEvents: loading ? "none" : "all"}}>
    <Title>Admin</Title>
    {docs.map((doc, docIdx) => (
      <div className={styles.mapDoc} key={docIdx}>
        <div className={styles.id}>{doc.id}</div>
        <div className={styles.separator}></div>
        <div className={styles.quaver_id}>{doc.map.id}</div>
        <div className={styles.separator}></div>
        <div className={styles.title}><Textfit mode='single' max={12}>{doc.map.title}</Textfit></div>
        <div className={styles.separator}></div>
        <div className={styles.diffName}><Textfit mode='single' max={12}>{doc.map.difficulty_name}</Textfit></div>
        <div className={styles.separator}></div>
        <div className={styles.creator}>{doc.map.creator_username}</div>
        <div className={styles.separator}></div>
        <select className={styles.category} onChange={(e) => changeCategory(doc.id, docIdx, e.target.value)}>
          {["Reading", "Hybrid", "Memory", "Reverse", "Splitscroll"].map((item, idx) => (
            <option value={item} key={idx} selected={doc.category === item}>{item}</option>
          ))}
        </select>
      </div>
    ))}
  </main>
  </>
}
