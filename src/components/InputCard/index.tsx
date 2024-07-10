import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './inputCard.module.scss';
import RatingDisplay from '../RatingDisplay';
import Dropdown from '../Dropdown';

interface InputCardProps {
  title: string;
  rating: number;
  setRating: Dispatch<SetStateAction<number>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  clamp: number[];
}

export default function InputCard(props: InputCardProps) {
  async function changeRating(v: string) {
    v = (v.match(/\d+/g) ?? [0]).join('');
    if (v === '') v = '0';
    if (v.charAt(0) === '0' && v.length > 1) v = v.slice(1);
    if (parseInt(v) < props.clamp[0]) v = props.clamp[0].toString();
    if (parseInt(v) > props.clamp[1]) v = props.clamp[1].toString();
    props.setRating(parseFloat(v));
  }

  return (
    <div className={styles.card}>
      <div className={styles.display}>
        <div className={styles.title}>{props.title}</div>
        <RatingDisplay
          rating={props.rating}
          letter={props.category.charAt(0)}
          range={props.clamp}
        />
      </div>
      <div className={styles.inputWrapper}>
        <input
          type='text'
          value={props.rating}
          onChange={(e) => changeRating(e.target.value)}
          className={styles.input}
        />
        <Dropdown
          selection={props.category}
          setSelection={props.setCategory}
          options={['Reading', 'Hybrid', 'Memory']}
        />
      </div>
    </div>
  );
}
