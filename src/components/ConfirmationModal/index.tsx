import Map from '@/interfaces/map';
import styles from './confirmationModal.module.scss';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  enabled: boolean;
  title: string;
  subtitle: string;
  mapData?: Partial<Map>;
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
  return (
    <div
      className={styles.modal}
      style={
        props.enabled ? { opacity: 1 } : { opacity: 0, pointerEvents: 'none' }
      }
    >
      <div className={styles.title}>{props.title}</div>
      <div className={styles.subtitle}>{props.subtitle}</div>
      {typeof props.mapData !== 'undefined' ? (
        <div className={styles.mapDivWrapper}>
          <MapDiv data={props.mapData} />
        </div>
      ) : null}
      <div className={styles.buttons}>
        <button className={styles.confirm} onClick={props.onConfirm}>
          Confirm
        </button>
        <button className={styles.cancel} onClick={props.onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function MapDiv({ data }: { data: Partial<Map> }) {
  return (
    <div className={styles.mapWrapper}>
      <div
        className={styles.mapSection}
        style={{ width: 'calc((35vw - 55px) * 4 / 3)', paddingRight: 0 }}
      >
        <section className={styles.mapTitle}>
          {data.artist} - {data.title}
        </section>
        <section className={styles.mapArtist}>
          By: <span style={{ color: '#dfb3f2' }}>{data.creator_username}</span>
        </section>
      </div>
      <div
        className={styles.mapSection}
        style={{
          width: 'calc((35vw - 55px) * 2 / 3)',
          textAlign: 'right',
          paddingLeft: 0,
        }}
      >
        <section className={styles.mapDifficulty}>
          [{((data.game_mode as number) - 1) * 3 + 4}K]{' '}
          {data.difficulty_rating?.toFixed(2)} - {data.difficulty_name}
        </section>
      </div>
    </div>
  );
}
