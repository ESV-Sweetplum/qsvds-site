import { ReactNode } from 'react';
import styles from './typography.module.scss';

export function Title({ children }: { children: ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}
