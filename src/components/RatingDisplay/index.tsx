import { CSSProperties, useEffect, useState } from 'react';
import styles from './ratingDisplay.module.scss';

interface RatingDisplayProps {
  rating: number | string;
  range: number[];
  scale?: number;
  style?: CSSProperties;
  letter?: string;
}

const COLOR_GRADIENT = [
  { cutOff: 0, color: [0, 255, 255] },
  { cutOff: 0.1, color: [0, 166, 255] },
  { cutOff: 0.2, color: [0, 255, 8] },
  { cutOff: 0.3, color: [255, 225, 0] },
  { cutOff: 0.4, color: [255, 42, 0] },
  { cutOff: 0.6, color: [191, 0, 255] },
  { cutOff: 0.8, color: [98, 5, 179] },
  { cutOff: 1, color: [255, 255, 255] },
];

const RATING_SHADOW = [
  '',
  '2px 2px 2px blue',
  '2px 2px 3px green',
  '2px 2px 3px orange',
  '2px 2px 4px red',
  '2px 2px 5px pink',
  '2px 2px 5px white',
  '2px 2px 5px yellow',
];

export default function RatingDisplay(props: RatingDisplayProps) {
  const [color, setColor] = useState<string>('rgb(0,255,255)');
  const [colorIndex, setColorIndex] = useState<number>(0);

  useEffect(() => {
    const percentageRating = parseInt(props.rating as string) / props.range[1];
    let cutoffIDX = COLOR_GRADIENT.findIndex(
      (obj, idx) =>
        obj.cutOff <= percentageRating &&
        (COLOR_GRADIENT[idx + 1]?.cutOff > percentageRating ||
          percentageRating === 1)
    );
    if (percentageRating === 1) cutoffIDX = COLOR_GRADIENT.length - 1;
    setColorIndex(cutoffIDX);
    setColor(
      `rgb(${COLOR_GRADIENT[cutoffIDX].color[0]},${COLOR_GRADIENT[cutoffIDX].color[1]},${COLOR_GRADIENT[cutoffIDX].color[2]})`
    );
  }, [props.rating, props.range]);

  return (
    <div
      className={styles.rating}
      style={{
        color: color,
        transform: `scale(${props.scale})`,
        ...props.style,
        textShadow: RATING_SHADOW[colorIndex],
      }}
    >
      {props.rating}
      <span style={{ fontSize: '3rem' }}>{props.letter as string}</span>
    </div>
  );
}
