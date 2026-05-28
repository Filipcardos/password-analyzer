import styles from './CrackTime.module.css'

export default function CrackTime({ times }) {
  return (
    <div className={styles.box}>
      {Object.entries(times).map(([label, { label: val, cls }]) => (
        <div key={label} className={styles.row}>
          <span className={styles.type}>{label}</span>
          <span className={`${styles.val} ${styles[cls]}`}>{val}</span>
        </div>
      ))}
    </div>
  )
}
