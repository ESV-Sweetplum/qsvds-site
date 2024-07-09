import styles from './primaryInput.module.scss';
import searchIcon from '../../../public/search-icon.svg';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { Category } from '@/interfaces/category';
import Dropdown from '../Dropdown';

interface PrimaryInputProps {
  value: string;
  changeValue: (v: string) => void;
  placeholderText?: string;
  onClick: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  searchMode: boolean;
  displayDropdown?: boolean;
  minRating?: string;
  maxRating?: string;
  showBanned?: boolean;
  setMinRating?: Dispatch<SetStateAction<string>>;
  setMaxRating?: Dispatch<SetStateAction<string>>;
  setShowBanned?: Dispatch<SetStateAction<boolean>>;
}

export default function PrimaryInput(props: PrimaryInputProps) {

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

function changeRating(v: string, f: Dispatch<SetStateAction<string>>) {
    v = (v.match(/\d+/g) ?? [0]).join('');
    if (v === '') v = '0';
    if (v.charAt(0) === '0' && v.length > 1) v = v.slice(1);
    if (parseInt(v) < 0) v = '0'
    if (parseInt(v) > 60) v = '60'
    f(v);
  }

  return (
    <div className={styles.wrapper} style={{height: `${50 + +dropdownVisible * 50}px`}}>
      <button
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className={styles.dropdown}
        style={{ width: `50px`, display: props.displayDropdown ? "block" : "none" }}
      >
        {dropdownVisible ? "^" : "v"}
      </button>
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
      <div className={styles.dropdownWrapper}>
        <div className={styles.ratingWrapper}>
            Min/Max Rating:
        <input type="text" placeholder='Min Rating' value={props.minRating} onChange={(e) => changeRating(e.target.value, props.setMinRating as any)} className={styles.ratingInput}/>
        <input type="text" placeholder='Max Rating' value={props.maxRating} onChange={(e) => changeRating(e.target.value, props.setMaxRating as any)} className={styles.ratingInput}/>
        </div>
        {/* <div className={styles.categoryWrapper}>
        Category: 
        <Dropdown
          selection={category}
          setSelection={setCategory}
          options={['All', 'Reading', 'Memory', 'Physical']}
        />
        </div> */}
        <div className={styles.bannedWrapper}>
            Show Banned Maps?
            <input type="checkbox" checked={props.showBanned} onChange={() => (props.setShowBanned as any)(!props.showBanned)} />
        </div>
      </div>
    </div>
  );
}
