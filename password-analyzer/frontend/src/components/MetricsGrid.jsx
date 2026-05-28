import styles from './MetricsGrid.module.css'

function classify(value, thresholds) {
  if (value >= thresholds.good) return 'good'
  if (value >= thresholds.warn) return 'warning'
  return 'danger'
}

export default function MetricsGrid({ length, charsetSize, uppercase, special }) {
  return (
    <div className={styles.grid}>
      <div className={styles.box}>
        <div className={styles.title}>COMPRIMENTO</div>
        <div className={`${styles.value} ${styles[classify(length, { good: 16, warn: 10 })]}`}>
          {length}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.title}>CHARSET SIZE</div>
        <div className={`${styles.value} ${styles[classify(charsetSize, { good: 62, warn: 36 })]}`}>
          {charsetSize}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.title}>MAIÚSCULAS</div>
        <div className={`${styles.value} ${styles[classify(uppercase, { good: 2, warn: 1 })]}`}>
          {uppercase}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.title}>ESPECIAIS</div>
        <div className={`${styles.value} ${styles[classify(special, { good: 2, warn: 1 })]}`}>
          {special}
        </div>
      </div>
    </div>
  )
}
