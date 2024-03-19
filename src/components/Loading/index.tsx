import styles from './loading.module.scss';

export default function Loading({ loadingStatus }: { loadingStatus: boolean }) {
  return (
    <div className={styles.loading} style={{ opacity: `${+loadingStatus}` }}>
      <div className={styles.halfCircle} />
      <div className={styles.halfCircle} style={{ border: 'none' }} />
    </div>
  );
}
