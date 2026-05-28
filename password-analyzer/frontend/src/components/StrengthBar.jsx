import { getStrength } from '../utils/analyzer'
import styles from './StrengthBar.module.css'

export default function StrengthBar({ score }) {
  const strength = getStrength(score)

  return (
    <div className={styles.wrapper}>
      <div className={styles.label} style={{ color: strength.color }}>
        {strength.label}
      </div>
      <div className={styles.barRow}>
        <span className={styles.barLabel}>pontuação</span>
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{ width: `${score}%`, background: strength.color }}
          />
        </div>
        <span className={styles.value} style={{ color: strength.color }}>
          {score}/100
        </span>
      </div>
    </div>
  )
}
