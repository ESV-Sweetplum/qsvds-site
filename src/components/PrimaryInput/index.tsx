import styles from './primaryInput.module.scss';
import searchIcon from '../../../public/search-icon.svg';
import Image from 'next/image';

interface PrimaryInputProps {
  value: string;
  changeValue: (v: string) => void;
  placeholderText?: string;
  onClick: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  searchMode: boolean;
}

export default function PrimaryInput(props: PrimaryInputProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type='text'
        value={props.value}
        onChange={(e) => props.changeValue(e.target.value)}
        placeholder={props.placeholderText ?? ''}
        className={styles.input}
        disabled={!props.searchMode}
        style={
          props.searchMode
            ? {}
            : {
                cursor: 'not-allowed',
                color: 'black',
              }
        }
        onKeyDown={(e) => e.key === "Enter" ? props.onClick() : {}}
      />
      <button
        onClick={props.onClick}
        className={styles.searchButton}
        style={{ width: `${+props.searchMode * 100}px` }}
      >
        <Image
          src={searchIcon}
          fill
          alt='searchIcon'
          className={styles.image}
          style={{ scale: +props.searchMode * 0.5 }}
        />
      </button>
      <button
        onClick={props.onConfirm}
        className={styles.confirmButton}
        style={{ width: `${150 - +props.searchMode * 150}px` }}
      >
        Submit
      </button>
      <button
        onClick={props.onCancel}
        className={styles.cancelButton}
        style={{ width: `${150 - +props.searchMode * 150}px` }}
      >
        Cancel
      </button>
    </div>
  );
}
